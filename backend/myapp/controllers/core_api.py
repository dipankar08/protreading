
from myapp.core.timex import IfTimeIs5MinOld
from myapp.core.dnetwork import ping_backend
from myapp.core.helper import get_param_or_default, get_param_or_throw, str_to_list
from myapp.core.dtypes import TCandleType
# from myapp.core.FastStorage import FastStorage
from myapp.core import timetracker
from flask import Blueprint, json, request
from myapp import tasks
from myapp.extensions import cache
from myapp.core.RetHelper import buildError, buildNotImplemented, buildSuccess, buildException
core_api = Blueprint('core_api_views', __name__)
import random
from flask_cors import CORS, cross_origin
from flask.globals import g
from myapp.core import dredis
from myapp.core.constant import CACHE_TIMEOUT_5MIN
from myapp.core import dglobaldata
from myapp.core import dlog
from myapp.core import dfilter
from myapp.core import dplot
from myapp.core.ddecorators import make_exception_safe
from myapp.core.rootConfig import SUPPORTED_CANDLE
from myapp.core import dhighlights, ddownload, danalytics


@core_api.before_request
def before_request_func():
    g.timings = {}


# Lookup redis key
@core_api.route('/redis')
@make_exception_safe
def redis():
    key: str = get_param_or_default(request, "key", "")
    result = dredis.getPickle(key, {})
    return buildSuccess("Saved redis data", result)


# Clear redis key
@ core_api.route('/clearcache')
@ make_exception_safe
def clearcache():
    " This will delete cache for all the data "
    # cache.delete_memoized(status)  >>> NOT WORKS
    # cache.delete_many("flask_cache_view//status") >> NOT WORKS
    if(request.args.get('key')):
        dredis.clear(get_param_or_throw(request, "key"))
    else:
        dredis.clearAll()
    return buildSuccess("Clear cache", {"random": random.randint(10, 100)})


# Build and look up indicator history
@core_api.route('/indicator')
@make_exception_safe
def indicator():
    "status of the app"
    candle_type: str = get_param_or_default(request, "candle_type", "1d")
    domain: str = get_param_or_default(request, "domain", "IN")
    sync: str = get_param_or_default(request, "sync", "0")
    reload: str = get_param_or_default(request, "reload", "0")
    result = dredis.getPickle(
        "indicator_history_{}".format(domain))

    # reload
    if reload == "1":
        if sync == "1":
            tasks.taskBuildIndicator(domain, candle_type)
            result = dredis.getPickle(
                "indicator_history_{}".format(domain))
            return buildSuccess("Got indicator", result)
        else:
            task_id = tasks.taskBuildIndicator.delay(domain, candle_type)
            return buildError("Indicator is not yet ready", "Scheduled task id: /result/{}".format(task_id.id))

    # No data
    if result is None:
        # submit task
        task_id = tasks.taskBuildIndicator.delay(domain, candle_type)
        return buildError("Indicator is not yet ready", "Scheduled task id: /result/{}".format(task_id.id))

    # Reload on time
    # mayUpdateStateData(domain, candle_type)

    return buildSuccess("Got indicator", result)


# Build the latest market data
@ core_api.route('/market')
@ make_exception_safe
def market():
    "status of the app"
    # Get the data for which doamin ?
    domain: str = get_param_or_default(request, "domain", "IN")
    # Do you want to return data and submit job to reload ?
    reload: str = get_param_or_default(request, "reload", "0")
    # Do you want to reload data on celeery in in this process for debugging?
    sync: str = get_param_or_default(request, "sync", "0")
    return buildSuccess("Status Ok", dglobaldata.getLatestMarketData(domain, reload, sync))


# Build the summary
@ cross_origin()
@ core_api.route('/summary')
@ make_exception_safe
def summary():
    mayRebuildData()
    summary = dhighlights.get_summary()
    if summary:
        return buildSuccess("calculated", summary)
    else:
        tasks.taskComputeSummary.delay()
        return buildError("Summary is not yet available")


# Perform screen
@ cross_origin()
@ core_api.route('/screen', methods=['POST', 'GET'])
@ make_exception_safe
def Screen():
    dglobaldata.checkLoadLatestData()
    result = dfilter.performScreen(
        get_param_or_default(request, 'domain', "IN"),
        get_param_or_throw(request, 'filter'),
        str_to_list(get_param_or_default(request, 'columns', '')))
    return buildSuccess(msg='Here is the list of Stocks', out=result)


# Chart are depeicated
"""
@ cross_origin()
@ core_api.route('/chart')
@ make_exception_safe
def chart():
    dglobaldata.checkLoadLatestData()
    symbol = get_param_or_throw(request, 'symbol')
    candle_type = get_param_or_default(request, "candle_type", "1d")
    duration = get_param_or_default(request, "duration", "30")
    reload = get_param_or_default(request, "reload", "0")
    return buildNotImplemented()
    # encoded_png = dplot.get_endcoded_png_for_chart(
    #    symbol, TCandleType(candle_type), duration, reload)
    # return buildSuccess("Image Return", "data:image/png;base64,{}".format(encoded_png))
"""


# For testing code.
@ core_api.route('/test')
@ make_exception_safe
def just_test():
    " This will delete cache for all the data "
    # ddownload.download(TCandleType.DAY_1)
    # dglobaldata.downloadAndBuildIndicator("IN", TCandleType.MIN_5)
    tasks.taskBuildIndicator("IN", "5m")
    # dhighlights.taskComputeSummary()
    return buildError("Please verify test in code.")


def mayRebuildData() -> bool:
    changed_candle = dglobaldata.checkLoadLatestData()
    if TCandleType.DAY_1 in changed_candle:
        tasks.taskComputeSummary.delay()
    return len(changed_candle) == 0

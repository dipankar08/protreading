# noqa: F401,E123
from flask import Blueprint, json, request
from myapp import tasks
# from myapp.core.FastStorage import FastStorage
from myapp.core import timetracker
from myapp.core.dnetwork import ping_backend
from myapp.core.dtypes import TCandleType
from myapp.core.helper import (get_param_or_default, get_param_or_throw,
                               str_to_list)
from myapp.core.RetHelper import (buildError, buildException,
                                  buildNotImplemented, buildSuccess)
from myapp.core.timex import IfTimeIs5MinOld
from myapp.extensions import cache

core_api = Blueprint('core_api_views', __name__)
import random

from flask.globals import g
from flask_cors import CORS, cross_origin
from myapp.core import dfilter, dglobaldata, dredis
from myapp.core.constant import CACHE_TIMEOUT_5MIN
from myapp.core.ddecorators import make_exception_safe
from myapp.core.rootConfig import ENABLED_CANDLE


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


# timestamp
@ core_api.route('/timestamp')
@ make_exception_safe
def timestamp():
    " Just return the timestamp "
    domain: str = get_param_or_default(request, "domain", "IN")
    return buildSuccess("Tiemstamp of server data retunrned", {"timestamp": dglobaldata.getLastUpdatedTimeStamp(domain)})


# Build and look up indicator history
@core_api.route('/indicator')
@make_exception_safe
def indicator():
    "status of the app"
    candle_type: str = get_param_or_default(request, "candle_type", "1d")
    domain: str = get_param_or_default(request, "domain", "IN")
    sync: str = get_param_or_default(request, "sync", "0")
    reload: str = get_param_or_default(request, "reload", "0")
    show_result: str = get_param_or_default(request, "result", "0")
    rkey = "indicator_history_{}".format(domain)
    result = dredis.getPickle(rkey)
    has_data = dredis.hasKey(rkey)

    # reload
    if reload == "1":
        if sync == "1":
            tasks.taskBuildIndicator(domain, candle_type)
            result = dredis.getPickle(rkey)
            return buildSuccess("Got indicator", result if show_result == "1" else 'result is hidden')
        else:
            task_id = tasks.taskBuildIndicator.delay(domain, candle_type)
            if has_data:
                return buildSuccess("Indicator is not yet ready", "Scheduled task id: /result/{}".format(task_id.id), )
            else:
                return buildError("Indicator is not yet ready", "Scheduled task id: /result/{}".format(task_id.id), )

    # No data
    if result is None:
        # submit task
        task_id = tasks.taskBuildIndicator.delay(domain, candle_type)
        return buildError("Indicator is not yet ready", "Scheduled task id: /result/{}".format(task_id.id))

    return buildSuccess("Got indicator", result if show_result == "1" else 'result is hidden')


# Perform screen
@ cross_origin()
@ core_api.route('/screen', methods=['POST', 'GET'])
@ make_exception_safe
def Screen():
    domain = get_param_or_default(request, 'domain', "IN")
    result = dfilter.performScreen(
        domain,
        get_param_or_throw(request, 'filter'),
        str_to_list(get_param_or_default(request, 'columns', '')))
    return buildSuccess(msg='Here is the list of Stocks', out={
        "result": result['result'], "timestamp": dglobaldata.getLastUpdatedTimeStamp(domain), 'error': result['last_error']})

# For testing code.


@ core_api.route('/test')
@ make_exception_safe
def just_test():
    " This will delete cache for all the data "
    # ddownload.download(TCandleType.DAY_1)
    # dglobaldata.downloadAndBuildIndicator("IN", TCandleType.MIN_5)
    tasks.taskBuildIndicator("IN", "5m")
    return buildError("Please verify test in code.")

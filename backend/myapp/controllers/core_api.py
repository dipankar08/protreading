
from myapp.core.dnetwork import ping_backend
from myapp.core.helper import get_param_or_default, get_param_or_throw, str_to_list
from myapp.core.dtypes import TCandleType
# from myapp.core.FastStorage import FastStorage
from flask import Blueprint, json, request
from myapp import tasks
from myapp.extensions import cache
from myapp.core.RetHelper import buildError, buildSuccess, buildException
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
from myapp.core import dhighlights


@core_api.before_request
def before_request_func():
    g.timings = {}


@core_api.route('/status')
@cache.cached(timeout=CACHE_TIMEOUT_5MIN, query_string=True)
@make_exception_safe
def status():
    "status of the app"
    ping_backend()
    return buildSuccess("Status Ok", {"random": random.randint(10, 100)})


@core_api.route('/task')
@make_exception_safe
def task():
    "Run the worker task from the web"
    task = get_param_or_throw(request, "task")
    if task == "snapshot_all":
        task_id = tasks.snapshot_pipeline_all.delay()
        return buildSuccess("task submitted", {"status_url": "/result/{}".format(task_id)})
    elif task == "chart_all":
        task_id = tasks.plot_chart_all.delay()
        return buildSuccess("task plot_chart_all submitted", {"status_url": "/result/{}".format(task_id)})
    elif task == "print":
        task_id = tasks.print_hello.delay()
        return buildSuccess("task print_hello submitted", {"status_url": "/result/{}".format(task_id)})
    elif task == 'highlights':
        return buildSuccess("calculated", dhighlights.build_highlights())
    else:
        return buildError("Task not found")


@cross_origin()
@core_api.route('/snapshot')
@make_exception_safe
def snapshot_intra():
    task_id = tasks.snapshot_pipeline.delay(
        get_param_or_throw(request, 'candle_type'))
    return buildSuccess("task submitted", {"status_url": "/result/{}".format(task_id)})


@core_api.route('/clearcache')
@make_exception_safe
def clearcache():
    " This will delete cache for all the data "
    # cache.delete_memoized(status)  >>> NOT WORKS
    # cache.delete_many("flask_cache_view//status") >> NOT WORKS
    dredis.clear(get_param_or_throw(request, "key"))
    return buildSuccess("Clear cache", {"random": random.randint(10, 100)})


@core_api.route('/highlights')
@make_exception_safe
def highlights():
    " This will delete cache for all the data "
    # cache.delete_memoized(status)  >>> NOT WORKS
    # cache.delete_many("flask_cache_view//status") >> NOT WORKS
    hl = dredis.get("india_highlights", None)
    if hl:
        return buildSuccess("Highlights returned", json.loads(hl))
    else:
        return buildError("No highlights is available")


@ cross_origin()
@ core_api.route('/screen', methods=['POST', 'GET'])
@make_exception_safe
def Screen():
    result = dfilter.filterstock(
        get_param_or_throw(request, 'filter'),
        str_to_list(get_param_or_default(request, 'columns', '')))
    return buildSuccess(msg='Here is the list of Stocks', out=result)


@ cross_origin()
@ core_api.route('/chart')
@make_exception_safe
def chart():
    symbol = get_param_or_throw(request, 'symbol')
    candle_type = get_param_or_default(request, "candle_type", "1d")
    duration = get_param_or_default(request, "duration", "30")
    reload = get_param_or_default(request, "reload", "0")
    encoded_png = dplot.get_endcoded_png_for_chart(
        symbol, TCandleType(candle_type), duration, reload)
    return buildSuccess("Image Return", "data:image/png;base64,{}".format(encoded_png))


def may_schedule_fetch_data(candle_type: TCandleType) -> str:
    if dglobaldata.is_dataload_start(candle_type):
        dlog.d("Skiped as a download already in progress")
        return ""

    if not dglobaldata.is_data_updated(candle_type):
        dlog.d("Skiped data has not yet updated")
        return ""
    # schedule the task
    task_id = tasks.snapshot_pipeline.delay(candle_type.value)
    return task_id

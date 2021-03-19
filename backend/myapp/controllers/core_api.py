
from myapp.core.helper import get_param_or_throw
from myapp.core.dtypes import TCandleType
# from myapp.core.FastStorage import FastStorage
from flask import Blueprint, render_template, Response, request
from myapp import tasks
from myapp.extensions import celery
from myapp.extensions import cache
from myapp.core.RetHelper import buildSuccess, buildException, buildError, buildNotImplemented, getParamFromRequest
core_api = Blueprint('core_api_views', __name__)
import random
from flask_cors import CORS, cross_origin
from flask.globals import g
from myapp.core import dredis
from myapp.core.constant import CACHE_TIMEOUT_1DAY, CACHE_TIMEOUT_30MIN, CACHE_TIMEOUT_5MIN
from myapp.core import dglobaldata
from myapp.core import dlog


@core_api.before_request
def before_request_func():
    g.timings = {}


@core_api.route('/status')
@cache.cached(timeout=CACHE_TIMEOUT_5MIN, query_string=True)
def status():
    "status of the app"
    try:
        return buildSuccess("Status Ok", {"random": random.randint(10, 100)})
    except Exception as e:
        return buildException(e)


@cross_origin()
@core_api.route('/snapshot')
def snapshot_intra():
    try:
        task_id = tasks.snapshot_pipeline.delay(
            get_param_or_throw(request, 'candle_type'))
        return buildSuccess("task submitted", {"status_url": "/result/{}".format(task_id)})
    except Exception as e:
        return buildException(e)


@core_api.route('/clearcache')
def clearcache():
    " This will delete cache for all the data "
    try:
        # cache.delete_memoized(status)  >>> NOT WORKS
        # cache.delete_many("flask_cache_view//status") >> NOT WORKS
        dredis.clear(get_param_or_throw(request, "key"))
        return buildSuccess("Clear cache", {"random": random.randint(10, 100)})
    except Exception as e:
        return buildException(e)


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

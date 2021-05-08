from datetime import timedelta
from myapp.core.timex import getCurTimeStr
from myapp.core.ddownload import download
from myapp.core.dnetwork import ping_celery
from myapp.core.ddecorators import log_func, make_exception_safe, task_common_action
from myapp.core.rootConfig import SUPPORTED_CANDLE
import time
import random
from typing import Any, Dict
from myapp.extensions import celery
from myapp.core import dlog
from myapp.core import danalytics
from myapp.core.dtypes import TCandleType
from myapp.core import dindicator
from myapp.core import dstorage, dhighlights
from myapp.core import dglobaldata, dredis
from myapp.core import dplot
from myapp.core.sync import getSymbolList, SUPPORTED_CHART_DURATION

# Log might needs to be inited for worker
danalytics.init()
danalytics.reportAction("task_boot_complete")


def buildTaskSuccess(msg: str, out: Any):
    return {"status": "success", "msg": msg, "out": out}


@celery.task(name="tasks.simple_task")
@log_func(remote_logging=True)
@task_common_action
def simple_task(argument: str) -> str:
    sleep_for = random.randrange(5, 11)
    print("Going to sleep for {} seconds...".format(sleep_for))
    time.sleep(sleep_for)
    hello = "Hello '{}' from task! We have slept for {} seconds".format(
        str(argument), sleep_for)
    return hello


# This will download - process - and save the file as pkl
# (1) Download
# (2) Build indicators
# (3) SAVE
# (4) Update the in cache.
@celery.task(name="tasks.code_api.task_build_indicator")
@log_func(remote_logging=True)
@task_common_action
def task_build_indicator(domain: str, candle_type: str):
    try:
        ping_celery()
        _candle_type = TCandleType(candle_type)
        dglobaldata.downloadAndBuildIndicator(domain, _candle_type)
        # Compute Summary
        if _candle_type == TCandleType.DAY_1:
            pass
            # dhighlights.compute_summary()
        buildTaskSuccess("task_build_indicator Done", None)
    except Exception as e:
        dlog.d("Got exception in task_build_indicator")
        dlog.ex(e)


@celery.task(name="tasks.code_api.task_build_indicator_all")
@log_func(remote_logging=True)
@task_common_action
def task_build_indicator_all():
    "This will download - process - and save the file as pkl"
    ping_celery()
    danalytics.reportAction("task_build_indicator_all_started")
    for x in SUPPORTED_CANDLE:
        dglobaldata.downloadAndBuildIndicator("IN", x)
    danalytics.reportAction("task_build_indicator_all_ended")
    # Compute Summary
    # dhighlights.compute_summary()
    # update
    dglobaldata.checkLoadLatestData()
    buildTaskSuccess("Complated all snap shot", None)


# Download and save latest data retrun bool as status
# It cache the data and it's TS
@celery.task(name="tasks.code_api.downloadLatestMarketData")
@log_func(remote_logging=True)
@task_common_action
def taskDownloadLatestMarketData(domain) -> bool:
    dlog.d("Downloading as cache is old")
    result = download.download(doamin=domain, period=1)
    if result[0] is True:
        dlog.d("Saving marjet data")
        resultJSON = dglobaldata.getLatestDataInJson(domain, result[1])
        # Save this data
        dredis.setPickle("market_data_{}".format(
            domain), {"data": resultJSON})
        dredis.set("market_ts_{}".format(domain), getCurTimeStr())
        return True
    return False


"""
@celery.task(name="tasks.code_api.plot_chart_all")
@log_func(remote_logging=True)
@task_common_action
def plot_chart_all() -> dict:
    "Build chart for all item"
    ping_celery()
    for duration in SUPPORTED_CHART_DURATION:
        for symbol in getSymbolList().keys():
            dplot.get_endcoded_png_for_chart(
                symbol=symbol, candle_type=TCandleType.DAY_1, duration=duration, reload="1")
    return buildTaskSuccess("Complated all snap shot", None)
"""


@celery.task(name="tasks.code_api.compute_summary")
@log_func(remote_logging=True)
@task_common_action
def compute_summary() -> dict:
    "Build chart for all item"
    dhighlights.compute_summary()
    return buildTaskSuccess("Complated all snap shot", None)


@celery.task(name='tasks.print')
@log_func(remote_logging=True)
@task_common_action
def print_hello():
    ping_celery()
    dlog.d('task run for print')

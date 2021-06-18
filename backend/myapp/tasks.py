import random
import time
from datetime import timedelta
from typing import Any, Dict

from myapp.core import (danalytics, dglobaldata, dhighlights, dindicator, dlog,
                        dplot, dredis, dstorage)
from myapp.core.ddecorators import (decrTaskCommonAction, decrTLogFunction,
                                    make_exception_safe)
from myapp.core.ddownload import download
from myapp.core.dnetwork import pingCelery
from myapp.core.dtypes import TCandleType
from myapp.core.rootConfig import ENABLED_CANDLE
from myapp.core.sync import SUPPORTED_CHART_DURATION, getSymbolList
from myapp.core.timex import getCurTimeStr
from myapp.extensions import celery

# Log might needs to be inited for worker
danalytics.init()
danalytics.reportAction("task_boot_complete")


def buildTaskSuccess(msg: str, out: Any):
    return {"status": "success", "msg": msg, "out": out}


@celery.task(name="tasks.simple_task")
@decrTLogFunction(remote_logging=True)
@decrTaskCommonAction
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
@celery.task(name="tasks.code_api.taskBuildIndicator")
@decrTLogFunction(remote_logging=True)
@decrTaskCommonAction
def taskBuildIndicator(domain: str, candle_type: str):
    try:
        pingCelery()
        _candle_type = TCandleType(candle_type)
        dglobaldata.downloadAndBuildIndicator(domain, _candle_type)
        # Compute Summary
        if _candle_type == TCandleType.DAY_1:
            pass
            # dhighlights.taskComputeSummary()
        buildTaskSuccess("taskBuildIndicator Done", None)
    except Exception as e:
        dlog.d("Got exception in taskBuildIndicator")
        dlog.ex(e)


@celery.task(name="tasks.code_api.taskBuildIndicatorAll")
@decrTLogFunction(remote_logging=True)
@decrTaskCommonAction
def taskBuildIndicatorAll():
    "This will download - process - and save the file as pkl"
    pingCelery()
    danalytics.reportAction("taskBuildIndicatorAll_started")
    for x in ENABLED_CANDLE:
        dglobaldata.downloadAndBuildIndicator("IN", x)
    danalytics.reportAction("taskBuildIndicatorAll_ended")
    # Compute Summary
    # dhighlights.taskComputeSummary()
    # update
    dglobaldata.checkLoadLatestData()
    buildTaskSuccess("Complated all snap shot", None)


# Download and save latest data retrun bool as status
# It cache the data and it's TS
@celery.task(name="tasks.code_api.downloadLatestMarketData")
@decrTLogFunction(remote_logging=True)
@decrTaskCommonAction
def taskDownloadLatestMarketData(domain) -> bool:
    dlog.d("Downloading as cache is old")
    result, data = download(doamin=domain, period=1)
    if result is True:
        dglobaldata.saveMarketDataFormDayDF(domain, data)
        return True
    return False


"""
@celery.task(name="tasks.code_api.plot_chart_all")
@decrTLogFunction(remote_logging=True)
@decrTaskCommonAction
def plot_chart_all() -> dict:
    "Build chart for all item"
    pingCelery()
    for duration in SUPPORTED_CHART_DURATION:
        for symbol in getSymbolList().keys():
            dplot.get_endcoded_png_for_chart(
                symbol=symbol, candle_type=TCandleType.DAY_1, duration=duration, reload="1")
    return buildTaskSuccess("Complated all snap shot", None)
"""


# Summary Task
@celery.task(name="tasks.code_api.taskComputeSummary")
@decrTLogFunction(remote_logging=True)
@decrTaskCommonAction
def taskComputeSummary() -> dict:
    "Build chart for all item"
    dhighlights.taskComputeSummary()
    return buildTaskSuccess("Complated all snap shot", None)


# Print Hello Task
@celery.task(name='tasks.print')
@decrTLogFunction(remote_logging=True)
@decrTaskCommonAction
def taskPrintHello():
    pingCelery()
    dlog.d('task run for print')

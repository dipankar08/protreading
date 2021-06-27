import random
import time
from datetime import timedelta
from typing import Any, Dict

from myapp.core import (danalytics, dglobaldata, dindicator, dlog, dplot,
                        dredis, dstorage)
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
    buildTaskSuccess("Complated all snap shot", None)

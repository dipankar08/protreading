from datetime import timedelta
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
from myapp.core import dstorage
from myapp.core import dglobaldata
from myapp.core import dplot
from myapp.core.sync import SUPPORT_SYMBOL, SUPPORTED_CHART_DURATION

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


@celery.task(name="tasks.code_api.snapshot")
@log_func(remote_logging=True)
@task_common_action
def snapshot_pipeline(candle_type: str) -> dict:
    "This will download - process - and save the file as pkl"
    print(candle_type)
    ping_celery()
    _candle_type = TCandleType(candle_type)
    return dglobaldata.download_process_data_internal(_candle_type)


@celery.task(name="tasks.code_api.snapshot_all")
@log_func(remote_logging=True)
@task_common_action
def snapshot_pipeline_all() -> dict:
    "This will download - process - and save the file as pkl"
    ping_celery()
    danalytics.reportAction("snapshot_pipeline_all_started")
    for x in SUPPORTED_CANDLE:
        dglobaldata.download_process_data_internal(x)
    danalytics.reportAction("snapshot_pipeline_all_ended")
    return buildTaskSuccess("Complated all snap shot", None)


@celery.task(name="tasks.code_api.plot_chart_all")
@log_func(remote_logging=True)
@task_common_action
def plot_chart_all() -> dict:
    "Build chart for all item"
    ping_celery()
    for duration in SUPPORTED_CHART_DURATION:
        for symbol in SUPPORT_SYMBOL.keys():
            dplot.get_endcoded_png_for_chart(
                symbol=symbol, candle_type=TCandleType.DAY_1, duration=duration, reload="1")
    return buildTaskSuccess("Complated all snap shot", None)


@celery.task(name='tasks.print')
@log_func(remote_logging=True)
@task_common_action
def print_hello():
    ping_celery()
    dlog.d('task run for print')

import time
import random
from typing import Dict
from myapp.extensions import celery
from myapp.core import dlog
from myapp.core import ddownload
from myapp.core.dtypes import TCandleType
from myapp.core import dindicator
from myapp.core import dstorage
from myapp.core import dglobaldata


@celery.task(name="tasks.simple_task")
def simple_task(argument: str) -> str:
    sleep_for = random.randrange(5, 11)
    print("Going to sleep for {} seconds...".format(sleep_for))
    time.sleep(sleep_for)
    hello = "Hello '{}' from task! We have slept for {} seconds".format(
        str(argument), sleep_for)
    print(hello)
    return hello


@celery.task(name="tasks.code_api.snapshot")
def snapshot_pipeline(argument: str) -> dict:
    "This will download - process - and save the file as pkl"
    candle_type = TCandleType(argument)
    return dglobaldata.download_process_data_internal(candle_type)

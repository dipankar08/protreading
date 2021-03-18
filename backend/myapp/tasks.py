import time
import random
from typing import Dict
from myapp.extensions import celery
from myapp.core import dlog
from myapp.core import ddownload
from myapp.core.MyTypes import TCandleType
from myapp.core import dindicator
from myapp.core import dstorage


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

    dlog.d("Staring snapshot_pipeline")
    dlog.d("1/3 Staring snapshot_pipeline")
    download_data = ddownload.download(candle_type)
    dlog.d("2/3 Processing data")
    processed_df = dindicator.process_inplace(download_data)
    dlog.d("3/3 Saving data")
    path_to_store = dstorage.get_default_path_for_candle(candle_type)
    dstorage.store_data_to_disk(processed_df, path_to_store)
    dlog.d("Completed snapshot_pipeline")
    return {"status": "success", "msg": "Completed snapshot pipeline", "out": None}

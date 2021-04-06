from logging import log
from myapp import tasks
from myapp.core.timetracker import mark_dataload_end, mark_dataload_start, should_fetch_data, should_load_data_from_disk
from myapp.core.ddecorators import trace_perf
from myapp.core.dtypes import TCandleType
from myapp.core.rootConfig import SUPPORTED_CANDLE
from myapp.core.DLogger import DLogger
from typing import Dict, List
from myapp.core import dstorage
from myapp.core import dlog
from myapp.core import dredis
import pandas as pd
from myapp.core import ddownload
from myapp.core import dindicator
from myapp.core import timetracker
import time
_candleTypeToDataFrameMap: Dict[str, pd.DataFrame] = {}


def loadDataForCandle(candle_type: TCandleType):
    try:
        _candleTypeToDataFrameMap[candle_type.value] = dstorage.load_data_to_disk(
            dstorage.get_default_path_for_candle((candle_type)))
        timetracker.mark_last_data_update_ts(candle_type)
        dlog.d("updating data...")
    except Exception as e:
        dlog.ex(e, "not able to load data from storage.")


@trace_perf
def load_data_on_boot():
    for candle_type in SUPPORTED_CANDLE:
        loadDataForCandle(candle_type=candle_type)


def get_df(symbol: str, candle_type: TCandleType = TCandleType.DAY_1, duration=50):
    "should be called by app"
    frame: pd.DataFrame = _candleTypeToDataFrameMap.get(
        candle_type.value, None)
    if frame is None:
        raise Exception("Data is not yet avilable")
    return frame[symbol].tail(duration)


def get_all_data():
    return _candleTypeToDataFrameMap


@trace_perf
def download_process_data_internal(candle_type: TCandleType):
    mark_dataload_start(candle_type)
    "You must call this function from view controler uusing task"
    dlog.d("Staring snapshot_pipeline")
    dlog.d("1/3 Staring snapshot_pipeline")
    ret_value, download_data = ddownload.download(candle_type)
    if ret_value is False:
        return {"status": "error", "msg": "something goes wrong", "out": None}
    dlog.d("2/3 Processing data")
    processed_df = dindicator.process_inplace(download_data)
    dlog.d("3/3 Saving data")
    path_to_store = dstorage.get_default_path_for_candle(candle_type)
    dstorage.store_data_to_disk(processed_df, path_to_store)
    dlog.d("Completed snapshot_pipeline")
    # Mark as done
    mark_dataload_end(candle_type)
    # update the data
    checkLoadLatestData()
    return {"status": "success", "msg": "Completed snapshot pipeline", "out": None}


# Call this function in all core api
def checkLoadLatestData():
    for candle_type in SUPPORTED_CANDLE:
        if should_load_data_from_disk(candle_type=candle_type):
            loadDataForCandle(candle_type=candle_type)
        if should_fetch_data(candle_type=candle_type):
            tasks.snapshot_pipeline.delay(candle_type.value)


load_data_on_boot()

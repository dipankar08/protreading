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
import time

_candleTypeToDataFrameMap: Dict[str, pd.DataFrame] = {}
_last_update_ts: Dict[str, int] = {}


def mark_dataload_start(candle_type: TCandleType):
    dredis.set("download_start_{}".format(candle_type.value), "1")


def mark_dataload_end(candle_type: TCandleType):
    dredis.set("download_start_{}".format(candle_type.value), "0")
    dredis.set("download_start_{}_ts".format(
        candle_type.value), int(time.time()))


def is_dataload_start(candle_type: TCandleType):
    return dredis.get("download_end_{}".format(candle_type.value)) == "1"


def mark_last_data_update_ts(candle_type: TCandleType):
    _last_update_ts[candle_type.value] = int(time.time())


def is_data_updated(candle_type: TCandleType) -> bool:
    "return true if memoruy already has data"
    last_mem_ts = _last_update_ts.get(candle_type.value)
    if not last_mem_ts:
        last_mem_ts = -1
    last_redis_ts = dredis.get("download_start_{}_ts".format(
        candle_type.value), "0")
    return int(last_redis_ts) > int(last_mem_ts)


@trace_perf
def load_data_on_boot():
    for candle_type in SUPPORTED_CANDLE:
        try:
            _candleTypeToDataFrameMap[candle_type.value] = dstorage.load_data_to_disk(
                dstorage.get_default_path_for_candle((candle_type)))
            dlog.d("updating data...")
        except Exception as e:
            dlog.ex("not able to load data from storage.", e)
        # Schedule any case
        # DONOT LOAD Data on BOOT
        # may_schedule_fetch_data(candle_type)


def get_df(symbol: str, candle_type: TCandleType = TCandleType.DAY_1, duration=50):
    "should be called by app"
    frame: pd.DataFrame = _candleTypeToDataFrameMap.get(
        candle_type.value, None)
    if frame is None:
        may_schedule_fetch_data(candle_type)
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
    download_data = ddownload.download(candle_type)
    dlog.d("2/3 Processing data")
    processed_df = dindicator.process_inplace(download_data)
    dlog.d("3/3 Saving data")
    path_to_store = dstorage.get_default_path_for_candle(candle_type)
    dstorage.store_data_to_disk(processed_df, path_to_store)
    dlog.d("Completed snapshot_pipeline")
    # Mark as done
    mark_dataload_end(candle_type)
    return {"status": "success", "msg": "Completed snapshot pipeline", "out": None}


# test
load_data_on_boot()

from myapp.core.rootConfig import SUPPORTED_CANDLE
import time
from typing import Dict
from myapp.core import dredis
from myapp.core import dlog
from myapp.core.dtypes import TCandleType
_last_update_ts: Dict[str, int] = {}
for x in SUPPORTED_CANDLE:
    _last_update_ts[x.value] = int(dredis.get(
        "download_start_{}_ts".format(x.value), "0"))


def reportNAN(data):
    dlog.e("NAN found for the item : {}".format(data))


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


# Data is fetched and should load from data.
def should_load_data_from_disk(candle_type: TCandleType) -> bool:
    last_mem_ts = _last_update_ts.get(candle_type.value)
    # data not exist
    if last_mem_ts == 0:
        return True
    # The mem data is old
    last_redis_ts = int(dredis.get(
        "download_start_{}_ts".format(candle_type.value), "0"))
    return int(last_redis_ts) > int(last_mem_ts)


# You should fetch the data from network
def should_fetch_data(candle_type: TCandleType) -> bool:
    last_mem_ts = _last_update_ts.get(candle_type.value)
    # data not exist
    if last_mem_ts == 0 or last_mem_ts is None:
        return True
    # The mem data is old
    last_redis_ts = int(dredis.get(
        "download_start_{}_ts".format(candle_type.value), "0"))
    return int(last_redis_ts) > int(last_mem_ts)

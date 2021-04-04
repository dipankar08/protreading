import time
from typing import Dict
from myapp.core import dredis
from myapp.core import dlog
from myapp.core.dtypes import TCandleType
_last_update_ts: Dict[str, int] = {}


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


def is_data_updated(candle_type: TCandleType) -> bool:
    "return true if memoruy already has data"
    last_mem_ts = _last_update_ts.get(candle_type.value)
    if not last_mem_ts:
        last_mem_ts = -1
    last_redis_ts = dredis.get("download_start_{}_ts".format(
        candle_type.value), "0")
    return int(last_redis_ts) > int(last_mem_ts)

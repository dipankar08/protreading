from logging import log
from pickle import TRUE
from myapp.core.timex import IfTimeIs5MinOld, getCurTimeStr
from myapp.core.sync import getSymbolList
from pandas.core.frame import DataFrame

import redis
from myapp import tasks
from myapp.core.timetracker import mark_dataload_end, mark_dataload_start, should_fetch_data, should_load_data_from_disk
from myapp.core.ddecorators import trace_perf
from myapp.core.dtypes import TCandleType
from myapp.core.rootConfig import SUPPORTED_CANDLE
from myapp.core.DLogger import DLogger
from typing import Dict, List
from myapp.core import dredis, danalytics, dstorage, dlog
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


import json
from ast import literal_eval


# This function get the last row of the dataframe
def getLatestDataInJson(df: DataFrame):
    final_result = {}
    try:
        df = df.tail(1)
        result = df.to_json(orient="records")
        parsed = json.loads(result)
        for x in parsed[0].keys():
            pair = literal_eval(x)
            symbol = pair[0]
            indicator = pair[1]
            value = parsed[0][x]
            if symbol not in final_result:
                final_result[symbol] = {}
            final_result[symbol][indicator] = value
        # print(json.dumps(final_result, indent=4))
    except Exception as e:
        dlog.ex(e)
        danalytics.reportException(e)
    # More some info.
    for x in final_result.keys():
        final_result[x]['sector'] = getSymbolList()[x]['sector']
    return final_result


@trace_perf
def download_process_data_internal(candle_type: TCandleType):
    mark_dataload_start(candle_type)
    "You must call this function from view controler uusing task"
    dlog.d("Staring snapshot_pipeline")
    dlog.d("1/3 Staring snapshot_pipeline")
    ret_value, download_data = ddownload.download(candle_type=candle_type)
    if ret_value is False:
        return {"status": "error", "msg": "something goes wrong", "out": None}
    dlog.d("2/3 Processing data")
    processed_df = dindicator.process_inplace(download_data)
    dlog.d("3/3 Saving data")
    path_to_store = dstorage.get_default_path_for_candle(candle_type)
    dstorage.store_data_to_disk(processed_df, path_to_store)

    dlog.d("4/4 Notify latest data to redis")
    dredis.setPickle("latest_{}".format(candle_type.value),
                     {'data': getLatestDataInJson(processed_df),
                      'update_ts': str(time.time()),
                      'update_ts_human':
                      time.strftime("%d/%m/%Y, %H:%M:%S GMT", time.gmtime())})
    dlog.d("Completed snapshot_pipeline")
    # Mark as done
    mark_dataload_end(candle_type)
    # update the data
    checkLoadLatestData()
    return {"status": "success", "msg": "Completed snapshot pipeline", "out": None}


# Call this function in all core api
def checkLoadLatestData():
    changed = []
    for candle_type in SUPPORTED_CANDLE:
        if should_load_data_from_disk(candle_type=candle_type):
            loadDataForCandle(candle_type=candle_type)
            changed.append(candle_type)
        if should_fetch_data(candle_type=candle_type):
            tasks.snapshot_pipeline.delay(candle_type.value)
    return changed


# This call will get latest market data
# First it will check if it is downloaded in 5 min returns it, if not schedule an task to download.
def getLatestMarketData(domain):
    last_update = dredis.get("market_ts_{}".format(domain), None)
    if last_update is None or last_update == 'None':
        dlog.d("No last update try downloading....")
        downloadLatestMarketData(domain)
    elif IfTimeIs5MinOld(last_update):
        dlog.d("data is 5 min old... downloading....")
        downloadLatestMarketData(domain)

    dlog.d("getting data from cache")
    return dredis.getPickle("market_data_{}".format(
        domain), {})


# Download and save latest data retrun bool as status
# It cache the data and it's TS
def downloadLatestMarketData(domain) -> bool:
    dlog.d("Downloading as cache is old")
    result = ddownload.download(doamin=domain, period=1)
    if result[0] is True:
        dlog.d("Saving marjet data")
        resultJSON = getLatestDataInJson(result[1])
        # Save this data
        dredis.setPickle("market_data_{}".format(
            domain), {"data": resultJSON})
        dredis.set("market_ts_{}".format(domain), getCurTimeStr())
        return True
    return False


load_data_on_boot()

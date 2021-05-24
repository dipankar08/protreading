import json
import time
from ast import literal_eval
from logging import log
from pickle import TRUE
from typing import Dict, List

import pandas as pd
import redis
from myapp import tasks
from myapp.core import (danalytics, ddownload, dindicator, dlog, dredis,
                        dstorage, timetracker)
from myapp.core.ddecorators import trace_perf
from myapp.core.dtypes import TCandleType
from myapp.core.optimization import shouldBuildIndicator
from myapp.core.rootConfig import SUPPORTED_CANDLE, SUPPORTED_DOMAIN
from myapp.core.sync import getSymbolList
from myapp.core.timetracker import (mark_dataload_end, mark_dataload_start,
                                    should_fetch_data,
                                    should_load_data_from_disk)
from myapp.core.timex import IfTimeIs5MinOld, getCurTimeStr
from pandas.core.frame import DataFrame

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


# This function get the last row of the dataframe
def getLatestDataInJson(domain, df: DataFrame):
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
        final_result[x]['sector'] = getSymbolList(domain=domain)[x]['sector']
    return final_result


# This function get the last row of the dataframe
def getLastNIndicatorInJson(domain, df: DataFrame, limit=15):
    final_result = {}
    try:
        df = df.tail(limit)
        result = df.to_json(orient="records")
        parsed = json.loads(result)
        for offset in range(limit):
            row = parsed[offset]
            # Key => 0, -1,-2....
            offset_key = (limit - offset - 1) * -1
            for x in row.keys():
                pair = literal_eval(x)
                symbol = pair[0]
                indicator = pair[1]
                value = row[x]
                if symbol not in final_result:
                    final_result[symbol] = {}
                if offset_key not in final_result[symbol]:
                    final_result[symbol][offset_key] = {}
                final_result[symbol][offset_key][indicator] = value
        # print(json.dumps(final_result, indent=4))
    except Exception as e:
        dlog.ex(e)
        danalytics.reportException(e)
    # More some info.
    # for x in final_result.keys():
    #    final_result[x]['sector'] = getSymbolList(domain=domain)[x]['sector']
    return final_result


# Rest all locks here - This is needed for restart the server
for candle_type in SUPPORTED_CANDLE:
    for domain in SUPPORTED_DOMAIN:
        dredis.set("downloadAndBuildindicator_{}_{}".format(
            domain, candle_type.value), "0")
dlog.d("Reset downloadAndBuildIndicator locks")


def getLastUpdatedTimeStamp(domain: str):
    result = {}
    for candle_type in SUPPORTED_CANDLE:
        result['{}-{}'.format(domain, candle_type.value)] = dredis.get("indicator_timestamp_{}_{}".format(
            domain, candle_type.value), "Data not found")
    return result

# It will create a cache for laest data frame


def saveMarketDataFormDayDF(domain: str, df: DataFrame):
    dlog.d("Saving market data...")
    resultJSON = getLatestDataInJson(domain, df)
    # Save this data
    dredis.setPickle("market_data_{}".format(
        domain), {"data": resultJSON})
    dredis.set("market_ts_{}".format(domain), getCurTimeStr())


# It will download and build the indicators
@ trace_perf
def downloadAndBuildIndicator(domain, candle_type: TCandleType):
    # Optimization
    if not shouldBuildIndicator(domain, candle_type):
        dlog.d("Ignore rebuilding shouldBuildIndicator")
        return

    # Locking
    lockkey = "downloadAndBuildindicator_{}_{}".format(
        domain, candle_type.value)
    if dredis.get(lockkey) == "1":
        dlog.d("downloadAndBuildIndicator locked for key {}".format(lockkey))
        raise Exception("downloadAndBuildIndicator is progress")
    dredis.set(lockkey, "1")

    try:
        dlog.d("downloadAndBuildIndicator start")

        dlog.d("downloadAndBuildIndicator download start")
        ret_value, download_data = ddownload.download(
            domain, interval=candle_type)
        if ret_value is False:
            dlog.d("Download fails")
            return {"status": "error", "msg": "something goes wrong", "out": None}

        dlog.d("downloadAndBuildIndicator building start")
        processed_df = dindicator.buildTechnicalIndicators(
            download_data, domain)

        # DONOT STOARE AS FILEdlog.d("downloadAndBuildIndicator: saving to storage start")
        #path_to_store = dstorage.get_default_path_for_candle(candle_type)
        #dstorage.store_data_to_disk(processed_df, path_to_store)

        dlog.d("downloadAndBuildIndicator: building indicator history map")
        # Building Indicator map for O(1) looks up.
        # This will be a 4d map
        # map[REL][1d][-1][close]...
        last15SlotIndicator = getLastNIndicatorInJson(domain, processed_df)
        indicator_history_key = "indicator_history_{}".format(domain)
        olddata = dredis.getPickle(indicator_history_key)
        if not olddata:
            olddata = {}
        for key in last15SlotIndicator.keys():
            if key not in olddata:
                olddata[key] = {}
            olddata[key][candle_type.value] = last15SlotIndicator.get(key)
        dredis.setPickle(indicator_history_key, olddata)
        dlog.d("downloadAndBuildIndicator: saved indicator history to {}".format(
            indicator_history_key))

        dlog.d("downloadAndBuildIndicator: saving to redis start")
        dredis.setPickle("indicator_data_{}_{}".format(domain, candle_type.value),
                         {'data': getLatestDataInJson(domain, processed_df),
                         'timestamp': getCurTimeStr()})

        # update market data
        if candle_type == TCandleType.DAY_1:
            saveMarketDataFormDayDF(domain, download_data)

        # Set TimeStamp key
        dredis.set("indicator_timestamp_{}_{}".format(
            domain, candle_type.value), getCurTimeStr())

        # unlock
        dredis.set(lockkey, "0")

        dlog.d("downloadAndBuildIndicator ends")
        return {"status": "success", "msg": "Completed snapshot pipeline", "out": None}
    except Exception as e:
        dredis.set(lockkey, "0")
        dlog.d("downloadAndBuildIndicator Exception happened")
        danalytics.reportException(
            e, "Exception in downloadAndBuildIndicator")
        dlog.ex(e)
        raise e
    finally:
        dredis.set(lockkey, "0")
        pass


# Call this function in all core api
def checkLoadLatestData():
    changed = []
    for candle_type in SUPPORTED_CANDLE:
        if should_load_data_from_disk(candle_type=candle_type):
            loadDataForCandle(candle_type=candle_type)
            changed.append(candle_type)
        if should_fetch_data(candle_type=candle_type):
            # Default load india
            tasks.taskBuildIndicator.delay("IN", candle_type.value)
    return changed


# This call will get latest market data
# First it will check if it is downloaded in 5 min returns it, if not schedule an task to download.
def getLatestMarketData(domain: str, reload: str = "0", sync: str = "0"):
    # Build indicator if not exist
    mayGetLatestStockData(domain, reload, sync)
    mayBuildStockIndicatorInBackground(domain, TCandleType.DAY_1, reload, sync)

    dlog.d("getting data from cache")
    return {
        'latest': dredis.getPickle("market_data_{}".format(domain)),
        'indicator': dredis.getPickle("indicator_data_{}_{}".format(domain, '1d'))
    }


# This will build the indicator in background.
def mayBuildStockIndicatorInBackground(domain: str, candle_type: TCandleType, reload: str, sync: str):
    # reload
    if reload == "1":
        if sync == "1":
            tasks.taskBuildIndicator(domain, candle_type=candle_type.value)
        else:
            tasks.taskBuildIndicator.delay(domain, candle_type.value)
        dlog.d("taskBuildIndicator: task submitted")
        return

    if dredis.getPickle("indicator_data_{}_{}".format(domain, '1d')) is None:
        # task submitted
        tasks.taskBuildIndicator.delay(domain, candle_type.value)
        dlog.d("task submitted")
    else:
        dlog.d("Data is already there")


# This will build the indicator in background.
def mayGetLatestStockData(domain: str, reload, sync: str):
    if(reload == "1"):
        dlog.d("taskDownloadLatestMarketData: submitting task")
        if sync == "1":
            tasks.taskDownloadLatestMarketData(domain)
        else:
            tasks.taskDownloadLatestMarketData.delay(domain)
        return
    last_update = dredis.get("market_ts_{}".format(domain), None)
    if last_update is None or last_update == 'None':
        dlog.d("No last update - submitting task")
        tasks.taskDownloadLatestMarketData.delay(domain)
    elif IfTimeIs5MinOld(last_update):
        dlog.d("data is 5 min old... submitting task")
        # tasks.taskDownloadLatestMarketData.delay(domain)
    else:
        dlog.d("Data is already there")


load_data_on_boot()

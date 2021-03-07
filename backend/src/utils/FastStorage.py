
from enum import Enum
from src.config.rootConfig import SUPPORTED_CANDLE
from src.config.MyTypes import TCandleType
from time import time
from src.utils.KeyValueStore import KeyValueStore
from typing import Dict, List
from src.utils.IndicatorBuilder import IndicatorBuilder
from src.utils.Decorators import timed
from src.utils.DLogger import DLogger
from src.utils.DownloadManager import DownloadManager

import pandas as pd
from pandas.core.frame import DataFrame


class FastStorage:
    __instance = None
    __progress = False
    __supported: List[TCandleType] = SUPPORTED_CANDLE
    __cache: Dict[TCandleType, DataFrame] = {}

    @staticmethod
    def getInstance():
        """ Static access method. """
        if FastStorage.__instance == None:
            FastStorage()
        return FastStorage.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if FastStorage.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            FastStorage.__instance = self
            self._ensureInit()

    def _ensureInit(self):
        for x in self.__supported:
            ret = self._loadData(x)
            if ret is not None and not ret.empty:
                DLogger.getInstance().d("{} found in cache skip network call".format(x.name))
                self.__cache[x] = ret
            else:
                self.__cache[x] = self.refreshData(x)

    def _loadData(self, candle_type: TCandleType) -> DataFrame:
        try:
            return pd.read_pickle("./datasets/{}.pkl".format(candle_type.value))
        except:
            return None

    def autoCheckRefresh(self):
        "You must call this function just before each api"
        pass

    def refreshData(self, candle_type: TCandleType):
        "Refresh data if needed"
        DLogger.getInstance().d("We are refreshing data by doing network call.")
        intervalPeriodMap = {
            TCandleType.DAY_1: '1y',
            TCandleType.MIN_15: '1d',
            TCandleType.MIN_30: '1d',
            TCandleType.MIN_5: '1d',
        }

        if not self._checkNeedRefresh(candle_type=candle_type):
            DLogger.getInstance().d("Skipping refresh as not needed")
            return

        df = DownloadManager.getInstance().downloadAll(
            candle_type.value, intervalPeriodMap.get(candle_type))
        # TODO: Before save, you must process it
        IndicatorBuilder.getInstance().process3DData(df)
        self._save(candle_type=candle_type, df=df)

    def _save(self, candle_type: TCandleType, df: DataFrame):
        df.to_pickle("./datasets/{}.pkl".format(candle_type.value))
        KeyValueStore.getInstance().set("ts_"+candle_type.name, time())

    def getData(self, candle_type: TCandleType):
        return self.__cache.get(candle_type)

    def _checkNeedRefresh(self, candle_type: TCandleType):
        last_time = KeyValueStore.getInstance().get("ts_"+candle_type.name)
        if last_time == None:
            return True

        if candle_type == TCandleType.DAY_1:
            return time() - last_time > 24*60*60
        elif candle_type == TCandleType.MIN_5:
            return time() - last_time > 5*60
        elif candle_type == TCandleType.MIN_15:
            return time() - last_time > 15*60
        elif candle_type == TCandleType.MIN_30:
            return time() - last_time > 30*60
        elif candle_type == TCandleType.HOUR_1:
            return time() - last_time > 60*60
        # We put this logic to check if the data is present and just fetched

        return True


# UNit Test
@timed
def test():
    fastStorage = FastStorage.getInstance()
    data = fastStorage.getData(TCandleType.DAY_1)
    print(data)


# test()

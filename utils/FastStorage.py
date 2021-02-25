
from enum import Enum
from typing import Dict, List
from utils.Decorators import timed
from utils.DLogger import DLogger
from utils.DownloadManager import DownloadManager


import pandas as pd
from pandas.core.frame import DataFrame


class TCandleType(Enum):
    MIN_5 = '5m'
    MIN_15 = '15m'
    MIN_30 = '20m'
    HOUR_1 = '1h',
    DAY_1 = '1d'


class FastStorage:
    __instance = None
    __progress = False
    __supported: List[TCandleType] = [
        TCandleType.DAY_1, TCandleType.MIN_5, TCandleType.MIN_15]
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
            return pd.read_pickle("{}.pkl".format(candle_type.value))
        except:
            return None

    def refreshData(self, candle_type: TCandleType):
        DLogger.getInstance().d("We are refreshing data by doing network call.")
        intervalPeriodMap = {
            TCandleType.DAY_1: '1y',
            TCandleType.MIN_15: '1d',
            TCandleType.MIN_30: '1d',
            TCandleType.MIN_5: '1d',
        }
        df = DownloadManager.getInstance().downloadAll(
            candle_type.value, intervalPeriodMap.get(candle_type))
        self._save(candle_type=candle_type, df=df)

    def _save(self, candle_type: TCandleType, df: DataFrame):
        df.to_pickle("{}.pkl".format(candle_type.value))

    def getData(self, candle_type: TCandleType):
        return self.__cache.get(candle_type)

    def _checkNeedRefresh(self, candle_type: TCandleType):
        # TODO
        # We put this logic to check if the data is present and just fetched
        return True


# UNit Test
@timed
def test():
    fastStorage = FastStorage.getInstance()
    data = fastStorage.getData(TCandleType.DAY_1)
    print(data)


test()

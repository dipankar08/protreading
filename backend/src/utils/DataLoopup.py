from src.config.MyTypes import TCandleType
from src.utils.FastStorage import FastStorage
from src.config.rootConfig import SUPPORTED_CANDLE
from src.utils.DLogger import DLogger
from typing import Dict, List
import pandas as pd

from src.utils.timex import time_this


class DataLookup:
    __instance = None
    _candleTypeToDataFrameMap: Dict[str, pd.DataFrame] = {}

    @staticmethod
    def getInstance():
        """ Static access method. """
        if DataLookup.__instance == None:
            DataLookup()
        return DataLookup.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if DataLookup.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            DataLookup.__instance = self
            self.updateModel()

    def updateModel(self):
        for candle_type in SUPPORTED_CANDLE:
            self._candleTypeToDataFrameMap[candle_type.value] = FastStorage.getInstance().getData(
                candle_type)

        DLogger.getInstance().d("Model updated")

    def getSample(self,  symbol: str, columns: List[str], candle_type: TCandleType = TCandleType.DAY_1):
        frame: pd.DataFrame = self._candleTypeToDataFrameMap.get(
            candle_type.value)
        return frame[symbol].tail(1).to_json(orient='records')

    def getAllData(self):
        return self._candleTypeToDataFrameMap


# Test
 # DataLookup.getInstance()

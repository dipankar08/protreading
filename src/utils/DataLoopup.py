from src.config.MyTypes import TCandleType
from src.utils.FastStorage import FastStorage
from src.config.rootConfig import SUPPORTED_CANDLE
from typing import Dict, List
import pandas as pd


class DataLookup:
    __instance = None
    _dataframeMap: Dict[str, pd.DataFrame] = {}

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
            for candle_type in SUPPORTED_CANDLE:
                self._dataframeMap[candle_type.value] = FastStorage.getInstance().getData(
                    candle_type)

    def getSample(self,  symbol: str, columns: List[str], candle_type: TCandleType = TCandleType.DAY_1):
        frame: pd.DataFrame = self._dataframeMap.get(candle_type.value)
        return frame[symbol].head(1).to_json(orient='records')

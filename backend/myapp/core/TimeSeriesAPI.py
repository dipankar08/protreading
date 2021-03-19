
from typing import List
from myapp.core.dtypes import TCandleType
from myapp.core.DataLoopup import DataLookup


class TimeSeriesAPI:
    __instance = None

    @staticmethod
    def getInstance():
        """ Static access method. """
        if TimeSeriesAPI.__instance == None:
            TimeSeriesAPI()
        return TimeSeriesAPI.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if TimeSeriesAPI.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            TimeSeriesAPI.__instance = self

    def getTSData(self, symbol_list: List, indicator_list: List, candle_type: TCandleType, duration: int):
        all_data = DataLookup.getInstance().getAllData()
        df1 = all_data.get(candle_type.value)
        df2 = df1.head(int(duration))
        result = {}
        result['time'] = [str(x) for x in df2.index]
        for x in symbol_list:
            result[x] = {}
            df3 = df2[x]
            for y in indicator_list:
                if y == 'candle':
                    result[x]['high'] = list(df3['high'].values)
                    result[x]['low'] = list(df3['low'].values)
                    result[x]['open'] = list(df3['open'].values)
                    result[x]['close'] = list(df3['close'].values)

                else:
                    result[x][y] = list(df3[y].values)
        return result

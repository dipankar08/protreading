from utils.Decorators import timed
import numpy as np
import pandas as pd
import talib
from utils.const import symbols
from utils.RetHelper import fixDict, fixRound, verifyOrThrow
all_range = [5, 8, 13, 20, 28, 50, 100, 200]


class IndicatorBuilder:
    __instance = None

    @staticmethod
    def getInstance():
        """ Static access method. """
        if IndicatorBuilder.__instance == None:
            IndicatorBuilder()
        return IndicatorBuilder.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if IndicatorBuilder.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            IndicatorBuilder.__instance = self

    @timed
    def process3DData(self, df):
        # If somevalue is nan and all calculation just dont work
        df.fillna(method='ffill', inplace=True)
        for ticker in symbols:
            # Make lower case << Validated
            df[ticker+'.NS', 'open'] = np.round(df[ticker+'.NS', 'Open'], 2)
            df[ticker+'.NS', 'close'] = np.round(df[ticker+'.NS', 'Close'], 2)
            df[ticker+'.NS', 'high'] = np.round(df[ticker+'.NS', 'High'], 2)
            df[ticker+'.NS', 'low'] = np.round(df[ticker+'.NS', 'Low'], 2)
            df[ticker+'.NS',
                'volume'] = np.round(df[ticker+'.NS', 'Volume'], 2)
            # define changes
            df[ticker+'.NS', 'close_change'] = fixRound((
                df[ticker+'.NS', 'close'] - df[ticker+'.NS', 'close'].shift(1))/df[ticker+'.NS', 'close'].shift(1)*100)
            df[ticker+'.NS', 'volume_change'] = fixRound((
                df[ticker+'.NS', 'volume'] - df[ticker+'.NS', 'volume'].shift(1))/df[ticker+'.NS', 'volume'].shift(1)*100)

            # Volatility
            df[ticker+'.NS', 'high_low_gap'] = df[ticker +
                                                  '.NS', 'high'] - df[ticker+'.NS', 'low']
            df[ticker+'.NS', 'high_low_gap_percentage'] = np.round((
                df[ticker+'.NS', 'high'] - df[ticker+'.NS', 'low'])/df[ticker+'.NS', 'close']*100, 2)
            # write your own info here << Validated
            for range in all_range:
                df[ticker+'.NS', "ema_{}".format(range)] = np.round(df[ticker+'.NS', "close"].ewm(
                    span=range, adjust=False).mean(), 2)
                df[ticker+'.NS', "sma_{}".format(range)] = np.round(
                    df[ticker+'.NS', "close"].rolling(range).mean(), 2)
                df[ticker+'.NS', "wma_{}".format(range)] = talib.WMA(
                    df[ticker+'.NS', "close"], timeperiod=range)
            # validated
            # macd and RSI
            # df[ticker+'.NS', 'macd'] = talib.MACD(df[ticker+'.NS', 'close'].as_matrix())
            # df[ticker+'.NS', "macd_macd"], df[ticker+'.NS', "macd_macdsignal"], df[ticker+'.NS', "macd_macdhist"] = talib.MACD(
            #    df.close, fastperiod=12, slowperiod=26, signalperiod=9)
            df[ticker+'.NS',
                'rsi_14'] = talib.RSI(df[ticker+'.NS', 'close'].values, 14)
            df[ticker+'.NS',
                'rsi_6'] = talib.RSI(df[ticker+'.NS', 'close'].values, 6)
            df[ticker+'.NS',
                'rsi_12'] = talib.RSI(df[ticker+'.NS', 'close'].values, 12)
            df[ticker+'.NS',
                'rsi_18'] = talib.RSI(df[ticker+'.NS', 'close'].values, 18)

            # band
            df[ticker+'.NS', 'bb_up_5'],  df[ticker+'.NS', 'bb_mid_5'],  df[ticker+'.NS', 'bb_down_5'] = talib.BBANDS(
                df[ticker+'.NS', 'close'], timeperiod=5)
            df[ticker+'.NS', 'bb_up_15'], df[ticker+'.NS', 'bb_mid_15'], df[ticker+'.NS', 'bb_down_15'] = talib.BBANDS(
                df[ticker+'.NS', 'close'], timeperiod=15)
            df[ticker+'.NS', 'bb_up_60'], df[ticker+'.NS', 'bb_mid_60'], df[ticker+'.NS', 'bb_down_60'] = talib.BBANDS(
                df[ticker+'.NS', 'close'], timeperiod=60)

            df[ticker+'.NS', 'sar'] = talib.SAR(df[ticker+'.NS', 'high'], df[ticker+'.NS', 'low'],
                                                acceleration=0.02, maximum=0.2)

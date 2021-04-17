from myapp.core.DLogger import DLogger
import numpy as np
import pandas as pd
import talib
from pandas import DataFrame
from myapp.core.sync import SUPPORTED_SYMBOL
from myapp.core.RetHelper import fixDict, fixRound, verifyOrThrow
from myapp.core.ddecorators import trace_perf
from myapp.core import dlog, danalytics
all_range = [5, 8, 13, 50, 100, 200]


@trace_perf
def process_inplace(df: DataFrame):
    # If somevalue is nan and all calculation just dont work
    df.fillna(method='ffill', inplace=True)
    for ticker in SUPPORTED_SYMBOL.keys():
        # Make lower case << Validated
        df[ticker, 'name'] = SUPPORTED_SYMBOL[ticker]['name']
        df[ticker, 'symbol'] = SUPPORTED_SYMBOL[ticker]['symbol']
        #df[ticker, 'sector'] = SUPPORTED_SYMBOL[ticker]['sector']
        df[ticker, 'open'] = np.round(df[ticker, 'Open'], 2)
        df[ticker, 'close'] = np.round(df[ticker, 'Close'], 2)
        df[ticker, 'high'] = np.round(df[ticker, 'High'], 2)
        df[ticker, 'low'] = np.round(df[ticker, 'Low'], 2)
        df[ticker,
            'volume'] = np.round(df[ticker, 'Volume'], 2)
        # define changes
        df[ticker, 'close_change_percentage'] = fixRound((
            df[ticker, 'close'] - df[ticker, 'close'].shift(1)) / df[ticker, 'close'].shift(1) * 100)
        df[ticker, 'volume_change_percentage'] = fixRound((
            df[ticker, 'volume'] - df[ticker, 'volume'].shift(1)) / df[ticker, 'volume'].shift(1) * 100)

        # Volatility
        df[ticker, 'high_low_gap'] = df[ticker, 'high'] - df[ticker, 'low']
        df[ticker, 'high_low_gap_percentage'] = np.round((
            df[ticker, 'high'] - df[ticker, 'low']) / df[ticker, 'close'] * 100, 2)
        # write your own info here << Validated
        for range in all_range:
            df[ticker, "ema_{}".format(range)] = np.round(df[ticker, "close"].ewm(
                span=range, adjust=False).mean(), 2)
            df[ticker, "sma_{}".format(range)] = np.round(
                df[ticker, "close"].rolling(range).mean(), 2)
            try:
                df[ticker, "wma_{}".format(range)] = talib.WMA(
                    df[ticker, "close"], timeperiod=range)
            except Exception as e:
                dlog.ex(e)
                df[ticker, "wma_{}".format(range)] = 0
        # validated
        # macd and RSI
        # df[ticker, 'macd'] = talib.MACD(df[ticker, 'close'].as_matrix())
        # df[ticker, "macd_macd"], df[ticker, "macd_macdsignal"], df[ticker, "macd_macdhist"] = talib.MACD(
        #    df.close, fastperiod=12, slowperiod=26, signalperiod=9)
        # TAlib cause exception so just be in the safe
        try:
            df[ticker, 'rsi_14'] = np.round(
                talib.RSI(df[ticker, 'close'].values, 14), 2)
            df[ticker,
                'rsi_18'] = talib.RSI(df[ticker, 'close'].values, 18)

            # band
            df[ticker, 'bb_up_5'], df[ticker, 'bb_mid_5'], df[ticker, 'bb_down_5'] = talib.BBANDS(
                df[ticker, 'close'], timeperiod=5)
            # df[ticker, 'bb_up_15'], df[ticker, 'bb_mid_15'], df[ticker, 'bb_down_15'] = talib.BBANDS(
            #    df[ticker, 'close'], timeperiod=15)
            # df[ticker, 'bb_up_60'], df[ticker, 'bb_mid_60'], df[ticker, 'bb_down_60'] = talib.BBANDS(
            #    df[ticker, 'close'], timeperiod=60)

            df[ticker, 'sar'] = talib.SAR(df[ticker, 'high'], df[ticker, 'low'],
                                          acceleration=0.02, maximum=0.2)

            df[ticker, 'atr_14'] = talib.ATR(
                df[ticker, 'high'], df[ticker, 'low'], df[ticker, 'close'], timeperiod=14)
            df[ticker, 'natr_14'] = talib.NATR(df[ticker, 'high'], df[ticker, 'low'],
                                               df[ticker, 'close'], timeperiod=14)
            df[ticker, 'tr_14'] = talib.TRANGE(
                df[ticker, 'high'], df[ticker, 'low'], df[ticker, 'close'])
        except Exception as e:
            dlog.ex(e)
            danalytics.reportAction("talib_exception_for_{}".format(ticker))
            df[ticker, 'rsi_14'] = -1
            df[ticker, 'rsi_18'] = -1
            df[ticker, 'bb_up_5'], df[ticker,
                                      'bb_mid_5'], df[ticker, 'bb_down_5'] = (-1, -1, -1)
            df[ticker, 'sar'] = -1
            df[ticker, 'atr_14'] = -1
            df[ticker, 'natr_14'] = -1
            df[ticker, 'tr_14'] = -1
    dlog.d("Indicator compution done proper way")
    return df

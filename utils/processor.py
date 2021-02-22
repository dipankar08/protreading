

import json as JSON
import os
import random
from utils.utils import fixDict, fixRound, verifyOrThrow
from flask import Response
from matplotlib.figure import Figure
import numpy as np
import pandas as pd
import talib
from utils.const import symbols
import yfinance as yf


mCacheAllDataSet = {}  # Replace it suing multi index later on
mIntervalMap = {}
all_range = [5, 8, 13, 20, 28, 50, 100, 200]


def computeDataForInterval(interval: str, reload="0"):
    global mCacheAllDataSet
    global mIntervalMap
    if interval in mIntervalMap and reload != "1":
        return

    print('[INFO] Begin compute Data( interval :{}'.format(interval))
    datafiles = os.listdir('datasets/{}'.format(interval))

    # Just clear the interval
    allSymbols = {}
    for filename in datafiles:
        symbol = filename.split('.')[0]
        df = pd.read_csv('datasets/{}/{}'.format(interval, filename))
        # If somevalue is nan and all calculation just dont work
        df.fillna(method='ffill', inplace=True)
        # Make lower case << Validated
        df['open'] = np.round(df['Open'], 2)
        df['close'] = np.round(df['Close'], 2)
        df['high'] = np.round(df['High'], 2)
        df['low'] = np.round(df['Low'], 2)
        df['volume'] = np.round(df['Volume'], 2)

        # define changes
        df['close_change'] = fixRound((
            df['close'] - df['close'].shift(1))/df['close'].shift(1)*100)
        df['volume_change'] = fixRound((
            df['volume'] - df['volume'].shift(1))/df['volume'].shift(1)*100)

        # Volatility
        df['high_low_gap'] = df['high'] - df['low']
        df['high_low_gap_percentage'] = np.round((
            df['high'] - df['low'])/df['close']*100, 2)

        df.drop(columns=['Open', 'Close', "High", "Low", "Volume"])
        # write your own info here << Validated
        for range in all_range:
            df["ema_{}".format(range)] = np.round(df["close"].ewm(
                span=range, adjust=False).mean(), 2)
            df["sma_{}".format(range)] = np.round(
                df["close"].rolling(range).mean(), 2)
            df["wma_{}".format(range)] = talib.WMA(
                df["close"], timeperiod=range)

        # validated

        # macd and RSI
        # df['macd'] = talib.MACD(df['close'].as_matrix())
        df["macd_macd"], df["macd_macdsignal"], df["macd_macdhist"] = talib.MACD(
            df.close, fastperiod=12, slowperiod=26, signalperiod=9)
        df['rsi_14'] = talib.RSI(df['close'].values, 14)
        df['rsi_6'] = talib.RSI(df['close'].values, 6)
        df['rsi_12'] = talib.RSI(df['close'].values, 12)
        df['rsi_18'] = talib.RSI(df['close'].values, 18)

        # band
        df['bb_up_5'],  df['bb_mid_5'],  df['bb_down_5'] = talib.BBANDS(
            df['close'], timeperiod=5)
        df['bb_up_15'], df['bb_mid_15'], df['bb_down_15'] = talib.BBANDS(
            df['close'], timeperiod=15)
        df['bb_up_60'], df['bb_mid_60'], df['bb_down_60'] = talib.BBANDS(
            df['close'], timeperiod=60)

        df['sar'] = talib.SAR(df['high'], df['low'],
                              acceleration=0.02, maximum=0.2)
        # Please add extra line here.
        allSymbols[symbol] = df
    # Update the cache.
    mIntervalMap[interval] = allSymbols
    # Build the revserse map : symbol->interval->df
    for sym in allSymbols:
        if sym not in mCacheAllDataSet:
            mCacheAllDataSet[sym] = {}
        mCacheAllDataSet[sym][interval] = allSymbols[sym]
    # Complated caching
    print('[INFO] End compute Data( interval :{})'.format(interval))


mLastReload = 0


def reloadAllData():
    global mLastReload
    if(mLastReload == 1):
        return
    mLastReload = 1
    for interval in ["1d", "5m"]:
        computeDataForInterval(interval)


def getDataForInterval(interval: str, reload="0"):
    global mIntervalMap
    if interval not in mIntervalMap:
        computeDataForInterval(interval, reload)
    return mIntervalMap.get(interval)


def getSymbolIntervalCache():
    global mCacheAllDataSet
    return mCacheAllDataSet


def ensureDailyDataLoaded():
    global mCacheAllDataSet
    if(mIntervalMap.get('1d')):
        return
    computeDataForInterval('1d', "1")


def getSampleData(symbol: str, columns):
    global mCacheAllDataSet
    ensureDailyDataLoaded()
    df = mCacheAllDataSet.get(symbol).get('1d')
    return JSON.loads(df.tail().loc[:, df.columns.isin(['Date']+columns)].to_json(orient='records'))

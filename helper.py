
import os
import random
from flask import Response
from matplotlib.figure import Figure
import numpy as np
import pandas as pd
import talib


mCacheDailyDataSet = None
all_range = [3, 4, 5, 6, 7, 8, 9, 10, 12, 13,
             14, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 100, 120, 150, 200]


def create_figure():
    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    xs = range(100)
    ys = [random.randint(1, 50) for x in xs]
    axis.plot(xs, ys)
    return fig


def getDailyDataSet(reload=False):
    global mCacheDailyDataSet
    if mCacheDailyDataSet and reload != "1":
        return mCacheDailyDataSet
    datafiles = os.listdir('datasets/daily')
    result = {}
    for filename in datafiles:
        symbol = filename.split('.')[0]
        df = pd.read_csv('datasets/daily/{}'.format(filename))
        # Make lower case << Validated
        df['open'] = np.round(df['Open'], 2)
        df['close'] = np.round(df['Close'], 2)
        df['high'] = np.round(df['High'], 2)
        df['low'] = np.round(df['Low'], 2)
        df['volume'] = np.round(df['Volume'], 2)
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

        #macd and RSI
        #df['macd'] = talib.MACD(df['close'].as_matrix())
        df["macd_macd"], df["macd_macdsignal"], df["macd_macdhist"] = talib.MACD(
            df.close, fastperiod=12, slowperiod=26, signalperiod=9)
        df['rsi'] = talib.RSI(df['close'].values, 14)
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
        result[symbol] = df
    mCacheDailyDataSet = result
    return mCacheDailyDataSet


def sample_buy_rule(df, i):
    cmin = min(df['ema_3'][i], df['ema_5'][i], df['ema_8'][i],
               df['ema_10'][i], df['ema_12'][i], df['ema_15'][i])
    cmax = max(df['ema_30'][i], df['ema_35'][i], df['ema_40'][i],
               df['ema_45'][i], df['ema_50'][i], df['ema_60'][i])
    return cmin > cmax


def sample_sell_rule(df, i):
    cmin = min(df['ema_3'][i], df['ema_5'][i], df['ema_8'][i],
               df['ema_10'][i], df['ema_12'][i], df['ema_15'][i])
    cmax = max(df['ema_30'][i], df['ema_35'][i], df['ema_40'][i],
               df['ema_45'][i], df['ema_50'][i], df['ema_60'][i])
    return cmin < cmax


def resolveCondition(cond: str):
    cond = cond.replace("\t", " ")
    cond = cond.replace("\n", " ")
    cond = cond.replace("\r", " ")
    tokens = cond.split(" ")
    processed = []
    for t in tokens:
        t = t.strip()
        if len(t) == 0:
            continue
        if (t in [')', '(', 'and', 'or', ">", "<", ">=", "<=", "+", "-", "*", "/"]):
            processed.append(t)
        elif t.startswith('num#'):
            processed.append(t.replace("num#", ""))
        elif t.startswith("indicator:"):
            # indicator:day:0:ema_50:
            indicator_tokens = t.split(":")
            candle_type = 'df'  # TODO indicator_tokens[1]
            offset = int(indicator_tokens[2]) - 1
            indicator = indicator_tokens[3]
            processed.append('{}.iloc[{}]["{}"]'.format(
                candle_type, offset, indicator))
        else:
            processed.append(t)
    return " ".join(processed)


def filterstock(condition):
    print('[INFO] Running scans for {}'.format((condition)))
    daily_data_set = getDailyDataSet()
    result = []
    for symbol in daily_data_set:
        df = daily_data_set[symbol]
        if(eval(condition)):
            result.append({
                'symbol': symbol,
                'close': df.iloc[-1]['close']
            })
    return result

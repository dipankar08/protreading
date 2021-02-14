
import os
import random
from flask import Response
from matplotlib.figure import Figure
import pandas as pd
import talib


mCacheDailyDataSet = None


def create_figure():
    fig = Figure()
    axis = fig.add_subplot(1, 1, 1)
    xs = range(100)
    ys = [random.randint(1, 50) for x in xs]
    axis.plot(xs, ys)
    return fig


ema_range = [5, 10, 15, 20, 25, 30, 50, 100, 200]
sma_range = [5, 10, 15, 20, 25, 30, 50, 100, 200]


def getDailyDataSet(reload: False):
    global mCacheDailyDataSet
    if mCacheDailyDataSet and reload != "1":
        return mCacheDailyDataSet
    datafiles = os.listdir('datasets/daily')
    result = {}
    for filename in datafiles:
        symbol = filename.split('.')[0]
        df = pd.read_csv('datasets/daily/{}'.format(filename))
        # write your own info here
        for ema in ema_range:
            df["ema_{}".format(ema)] = df["Close"].ewm(
                span=ema, adjust=False).mean()
        for sma in sma_range:
            df["sma_{}".format(sma)] = df["Close"].rolling(sma).mean()
        # Please add extra line here.
        result[symbol] = df
    mCacheDailyDataSet = result
    return mCacheDailyDataSet

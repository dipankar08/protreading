from utils.processor import getDataForInterval
import yfinance as yf
from utils.const import symbols

import os
import random
from utils.utils import fixDict, fixRound, verifyOrThrow
from flask import Response
from matplotlib.figure import Figure
import numpy as np
import pandas as pd
import talib
import yfinance as yf


def download(interval, period):
    # Valid intervals: [1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo]
    print('[INFO] fetching data for intervale : {}'.format(interval))
    for x in symbols:
        data = yf.download(x+'.NS', period=period, interval=interval)
        data.to_csv('datasets/{}/{}.csv'.format(interval, x))
        getDataForInterval(interval, "1")

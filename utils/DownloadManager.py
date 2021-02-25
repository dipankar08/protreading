from pandas.core.frame import DataFrame
from utils.timex import time_this
from utils.processor import getDataForInterval
import yfinance as yf
from utils.const import symbols

import os
import random
from utils.RetHelper import fixDict, fixRound, verifyOrThrow
from flask import Response
from matplotlib.figure import Figure
import numpy as np
import pandas as pd
import talib
import yfinance as yf
from multiprocessing import Pool


class DownloadManager:
    __instance = None

    @staticmethod
    def getInstance():
        """ Static access method. """
        if DownloadManager.__instance == None:
            DownloadManager()
        return DownloadManager.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if DownloadManager.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            DownloadManager.__instance = self

    def downloadAll(self, interval='1d', period='1y') -> DataFrame:
        ticker = [x+'.NS' for x in symbols.keys()]
        data = yf.download(
            tickers=ticker,
            period=period,
            interval=interval,
            group_by='ticker',
            auto_adjust=False,
            prepost=False,
            threads=True,
            proxy=None
        )
        return data


# unit tets
# DownloadManager.getInstance().downloadAll()

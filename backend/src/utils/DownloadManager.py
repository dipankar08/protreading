## pyright: strict
from pandas.core.frame import DataFrame
from src.config.MyTypes import TCandleType
from src.utils.timex import time_this
from src.utils.processor import getDataForInterval
import yfinance as yf
from src.config.symbols import symbols

import os
import random
from src.utils.RetHelper import fixDict, fixRound, verifyOrThrow
from flask import Response
from matplotlib.figure import Figure
import numpy as np
import pandas as pd
import talib
import yfinance as yf
from multiprocessing import Pool
from src.utils.DLogger import DLogger
from src.utils.convertion import covert_to_period_from_duration


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

    def downloadAll(self, interval: TCandleType = TCandleType.DAY_1, period=100) -> DataFrame:
        DLogger.getInstance().stack()
        ticker = [x for x in symbols.keys()]
        data = yf.download(
            tickers=ticker,
            period=covert_to_period_from_duration(interval, period),
            interval=interval.value,
            group_by='ticker',
            auto_adjust=False,
            prepost=False,
            threads=True,
            proxy=None
        )
        return data


# unit tets
# DownloadManager.getInstance().downloadAll()

from utils.timex import time_this
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
from multiprocessing import Pool


class DownloadManager:
    __instance = None
    __progress = False

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

    def downloadHelp(self, data):
        path = 'datasets/{}/{}.csv'.format(data.get('interval'),
                                           data.get('symbol'))
        data = yf.download(data.get('symbol')+'.NS',
                           period=data.get('period'), interval=data.get('interval'))
        print(path)
        data.to_csv(path)

    @time_this
    def download(self, interval, period, dry_run=False):
        # Valid intervals: [1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo]
        print('[INFO] fetching data for intervale : {}'.format(interval))
        if self.__progress:
            raise Exception("One download already in progress")

        self.__progress = True
        __pool = Pool()
        __pool.map(self.downloadHelp, [{'symbol': x, 'period': period,
                                        'interval': interval} for x in symbols])

        getDataForInterval(interval, "1")
        self.__progress = False

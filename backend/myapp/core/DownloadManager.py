## pyright: strict
from pandas.core.frame import DataFrame
from myapp.core.MyTypes import TCandleType
import yfinance as yf
from myapp.core.symbols import symbols
from myapp.core.dlog import stack
from myapp.core.convertion import covert_to_period_from_duration
from myapp.core import dredis


def download(interval: TCandleType = TCandleType.DAY_1, period=100) -> DataFrame:
    key = "download_progress_" + interval.value
    if(dredis.get(key) == "1"):
        raise Exception("Download already progress")
    data = None
    dredis.set(key, "1")
    try:
        stack()
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
    except Exception as e:
        return None
    finally:
        dredis.set(key, "0")
    return data

# Delete All below


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

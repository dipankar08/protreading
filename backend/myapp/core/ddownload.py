## pyright: strict
from myapp.core.ddecorators import trace_perf
from pandas.core.frame import DataFrame
from myapp.core.dtypes import TCandleType
import yfinance as yf
from myapp.core.symbols import symbols
from myapp.core.dlog import stack
from myapp.core.convertion import covert_to_period_from_duration
from myapp.core import dredis
from myapp.core import danalytics


@trace_perf
def download(interval: TCandleType = TCandleType.DAY_1, period=100) -> DataFrame | str:
    key = "download_progress_" + interval.value
    if(dredis.get(key) == "1"):
        danalytics.reportAction(
            "ignore_duplicate_fetch_download_already_progress")
        return "ALREADY_IN_PROGRESS"
    data = None
    dredis.set(key, "1")
    try:
        # stack()
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

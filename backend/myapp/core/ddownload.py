## pyright: strict
from myapp.core.rootConfig import SUPPORTED_CANDLE
import typing
from myapp.core.DLogger import DLogger
from myapp.core.ddecorators import trace_perf
from pandas.core.frame import DataFrame
from myapp.core.dtypes import TCandleType
import yfinance as yf
from myapp.core.sync import getSymbolList
from myapp.core.dlog import stack
from myapp.core.convertion import covert_to_period_from_duration
from myapp.core import dredis, dlog, danalytics

### Here is how to test down your own#
"""
    import yfinance as yf
yf.download("TCS.NS")
"""

# Rest all locks here
for candle_type in SUPPORTED_CANDLE:
    dredis.set("download_progress_{}".format(candle_type.value), "0")
dlog.d("Reset download locks")


@trace_perf
def download(doamin="IN", interval: TCandleType = TCandleType.DAY_1, period=100) -> typing.Tuple[bool, DataFrame]:
    key = "download_progress_" + interval.value
    if(dredis.get(key) == "1"):
        danalytics.reportAction(
            "ignore_duplicate_fetch_download_already_progress")
        return (False, None)
    data = None
    dredis.set(key, "1")
    try:
        # stack()
        ticker = [x for x in getSymbolList(doamin).keys()]
        data = yf.download(
            tickers=ticker,
            period=covert_to_period_from_duration(interval, period),
            interval=interval.value,
            group_by='ticker',
            auto_adjust=False,
            prepost=False,
            threads=True,
            proxy=None,
            rounding=True
        )
    except Exception as e:
        dlog.ex(e)
        return (False, None)
    finally:
        dredis.set(key, "0")
    # Sometime it ret duplicate results for the last row so drop it,
    data = data[~data.index.duplicated(keep='last')]
    return (True, data)

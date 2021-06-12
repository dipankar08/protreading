# When you fetch the data using yahoo finance, Most of time it returns worng data
# This might be as you have used a lot of calls thus yahho server return last 14 data as null.
# This program will store all the data in a pickel file.

# datastore.pkl should should a big map like:
# AllData[1d|5m|1h][date][symbol] = { Open, High, Low, Close, Adj Close, Volume}
# Running this script will update this DB.
from myapp.core.sync import getSymbolList
from myapp.core.dtypes import TCandleType
import yfinance as yf
yf.download("TCS.NS")

import pickle
import pdb

# Reading root Data
rootData = {}
with open('myapp/core/datastore/datastore.pkl', 'rb') as f:
    rootData = pickle.load(f)
    if not rootData:
        rootData = {}


def downloadData(domain, doamin, interval: TCandleType = TCandleType.DAY_1, period=50):
    try:
        # stack()
        ticker = [x for x in getSymbolList(doamin).keys()]
        data = yf.download(
            tickers=ticker,
            period=period,
            interval=interval.value,
            group_by='ticker',
            auto_adjust=False,
            prepost=False,
            threads=True,
            proxy=None,
            rounding=True
        )
        pdb.set_trace()
    except Exception as e:
        dlog.ex(e)
        return (False, None)


downloadData("IN", TCandleType.DAY_1, 10)

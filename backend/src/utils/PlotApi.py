import io
from matplotlib.pyplot import ylabel
import yfinance as yf
import mplfinance as fplt
import matplotlib
matplotlib.use('Agg')


def buildChartInPng(symbol, df, options={}):
    try:
        fplt.plot(
            df.tail(50),
            type='candle',
            style='charles',
            title=symbol,
            ylabel='',
            ylabel_lower='',
            figratio=(12, 6),
            #mav=(3, 6, 9),
            volume=True,
            # ylabel_lower='Shares\nTraded',
            show_nontrading=True,
            savefig='datasets/screenshot/{}.png'.format(symbol)
        )
    except Exception as e:
        raise e

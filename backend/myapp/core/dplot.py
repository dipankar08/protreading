import io
from myapp.core.ddecorators import dump_args
import os
from myapp.core.dtypes import TCandleType
from matplotlib.pyplot import ylabel
from pandas.core.frame import DataFrame
import yfinance as yf
import mplfinance as fplt
from myapp.core import dglobaldata
from myapp.core import dlog
import base64


def get_endcoded_png_for_chart(symbol: str, candle_type: TCandleType, duration: str, reload: str):
    dlog.d("get_endcoded_png_for_chart called with symbol:{}, type:{}, duration:{}".format(
        symbol, candle_type, duration))
    import matplotlib
    matplotlib.use('Agg')
    path = "datasets/cache/screenshot/{}-{}-{}.png".format(
        symbol, candle_type.value, duration)
    if not os.path.exists(path) or reload == "1":
        df = dglobaldata.get_df(
            symbol, candle_type, int(duration))
        build_chart_and_save(symbol, df, path)

    with open(path, "rb") as binary_file:
        binary_file_data = binary_file.read()
        base64_encoded_data = base64.b64encode(binary_file_data)
        base64_message = base64_encoded_data.decode('utf-8')
        return base64_message


def build_chart_and_save(symbol: str, df: DataFrame, path: str):
    try:
        fplt.plot(
            df,
            type='candle',
            style='charles',
            # title=symbol,
            ylabel='',
            ylabel_lower='',
            figratio=(12, 6),
            # mav=(3, 6, 9),
            volume=True,
            # ylabel_lower='Shares\nTraded',
            show_nontrading=False,
            savefig=dict(fname=path, bbox_inches="tight")
        )
    except Exception as e:
        raise e

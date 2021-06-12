

from myapp.core.dtypes import TCandleType
import pandas as pd
from pandas.core.frame import DataFrame


def get_default_path_for_candle(candle_type: TCandleType):
    return "./datasets/{}.pkl".format(candle_type.value)


def store_data_to_disk(df: DataFrame, path):
    try:
        df.to_pickle(path)
    except:
        raise Exception("Not able to store data")


def load_data_to_disk(path) -> DataFrame:
    try:
        return pd.read_pickle(path)
    except:
        raise Exception("Not able to load data")

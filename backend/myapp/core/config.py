
from myapp.core.dtypes import TCandleType
_intervalPeriodMap = {
    TCandleType.DAY_1: 180,
    TCandleType.MIN_15: 180,
    TCandleType.MIN_30: 180,
    TCandleType.MIN_5: 180,
    TCandleType.HOUR_1: 180,
}


def get_default_period(candle_type: TCandleType):
    return _intervalPeriodMap.get(candle_type)

from myapp.core.dtypes import TCandleType


def covert_to_period_from_duration(candle_type: TCandleType, duration: int):
    res = 0.0
    if candle_type == TCandleType.DAY_1:
        res = duration
    elif candle_type == TCandleType.HOUR_1:
        res = duration / 8
    elif candle_type == TCandleType.MIN_30:
        res = duration / 16
    elif candle_type == TCandleType.MIN_15:
        res = duration / 30
    elif candle_type == TCandleType.MIN_5:
        res = duration / 50
    return '{}d'.format(int(res))


# Test
def test():
    print(covert_to_period_from_duration(TCandleType.DAY_1, 100))
    print(covert_to_period_from_duration(TCandleType.HOUR_1, 100))
    print(covert_to_period_from_duration(TCandleType.MIN_30, 100))
    print(covert_to_period_from_duration(TCandleType.MIN_15, 100))
    print(covert_to_period_from_duration(TCandleType.MIN_5, 100))

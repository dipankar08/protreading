
from myapp.core.dtypes import TCandleType
from typing import List

SUPPORTED_CANDLE: List[TCandleType] = [
    TCandleType.MIN_5, TCandleType.MIN_15, TCandleType.DAY_1, TCandleType.HOUR_1, TCandleType.MIN_30]
ENABLED_CANDLE: List[TCandleType] = [TCandleType.MIN_5, TCandleType.DAY_1]

SUPPORTED_DOMAIN: List[str] = ['IN', "UK", "USA"]
ENABLED_DOMAIN: List[str] = ["IN"]

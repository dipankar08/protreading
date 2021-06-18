
from typing import List

from myapp.core.dtypes import TCandleType

ENABLED_CANDLE: List[TCandleType] = [TCandleType.MIN_5, TCandleType.DAY_1]

SUPPORTED_DOMAIN: List[str] = ['IN', "UK", "USA"]
ENABLED_DOMAIN: List[str] = ["IN"]

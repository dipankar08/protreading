from myapp.core.dtypes import TCandleType
from myapp.core import dfilter

rules = [
    {
        "name": "top_gainer",
        "condition": "true",  # DONE
        "columns": [],
        "sort_by": "change",
        "limit": 10,
        "active":True,
    },
    {
        "name": "top_looser",
        "condition": "true",  # DONE
        "columns": [],
        "sort_by": "-change",
        "limit": 10,
        "active":True,
    },
    {
        "name": "top_active",
        "condition": "true",  # DONE
        "columns": [],
        "sort_by": "volume",
        "limit": 10,
        "active":True,
    },
    {
        "name": "only_buyer",
        "condition": "indicator:1d:0:close ==  indicator:1d:0:high",  # DONE
        "sort_by": "change",
        "limit": 10,
        "columns": [],
        "active":True,
    },
    {
        "name": "only_seller",
        "condition": "indicator:1d:0:close ==  indicator:1d:0:low",  # DONE
        "sort_by": "change",
        "limit": 10,
        "columns": [],
        "active":True,
    },
    {
        "name": "52_weeks_high",
        "condition": "true",  # NOT DONE
        "sort_by": "-volume",
        "limit": 10,
        "columns": [],
        "active":True,
    },
    {
        "name": "52_weeks_low",
        "condition": "true",  # NOT DONE
        "sort_by": "close",
        "limit": 10,
        "columns": [],
        "active":True,
    },
    {
        "name": "overbought",
        "condition": "indicator:1d:0:rsi_14 > 60",  # DONE
        "columns": ["indicator:1d:0:rsi_14"],
        "sort_by": "change",
        "limit": 10,
        "active":True,
    },
    {
        "name": "oversold",
        "condition": "indicator:1d:0:rsi_14 < 40",  # DONE
        "columns": ["indicator:1d:0:rsi_14"],
        "sort_by": "-change",
        "limit": 10,
        "active":True,
    },
    {
        "name": "uptrend_3_days",
        # DONE
        "condition": "( indicator:1d:0:close > indicator:1d:-1:close ) and ( indicator:1d:-1:close > indicator:1d:-2:close )",
        "columns": [],
        "sort_by": "change",
        "limit": 10,
        "active":True,
    },
    {
        "name": "downtrend_3_days",
        # DONE
        "condition": "( indicator:1d:0:close < indicator:1d:-1:close ) and ( indicator:1d:-1:close < indicator:1d:-2:close )",
        "columns": [],
        "sort_by": "-change",
        "limit": 10,
        "active":True,
    },
]
from myapp.core.constant import CACHE_TIMEOUT_1DAY, CACHE_TIMEOUT_30MIN, CACHE_TIMEOUT_5MIN

from myapp.extensions import cache


@cache.cached(timeout=CACHE_TIMEOUT_5MIN, query_string=True)
def build_highlights():
    result = {}
    global rules
    for x in rules:
        if not x.get('active'):
            continue
        ret = dfilter.filterstock(
            condition=x.get('condition'),
            columns=x.get("columns"),
            sort_by=x.get('sort_by'),
            limit=x.get('limit')
        )
        result[x.get('name')] = {"name": x.get('name'), "data": ret}
    print(result)
    return result

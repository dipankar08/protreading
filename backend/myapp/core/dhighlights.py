from myapp.core.dtypes import TCandleType
from myapp.core import dfilter, dredis
from myapp.core.ddecorators import smart_cache

rules = [
    {
        "name": "high_volume",
        # DONE
        "condition": "true",
        "columns": [],
        "sort_by": "volume",
        "limit": 10,
        "active":True,
    },
    {
        "name": "high_low_gap",
        # DONE
        "condition": "true",
        "columns": ["indicator:1d:0:high_low_gap_percentage"],
        "sort_by": "indicator:1d:0:high_low_gap_percentage",
        "limit": 10,
        "active":True,
    },
    {
        "name": "avarage_true_range",
        # DONE
        "condition": "true",
        "columns": ["indicator:1d:0:atr_14"],
        "sort_by": "indicator:1d:0:atr_14",
        "limit": 10,
        "active":True,
    },
    {
        "name": "normalized_avarage_true_range",
        # DONE
        "condition": "true",
        "columns": ["indicator:1d:0:natr_14"],
        "sort_by": "indicator:1d:0:natr_14",
        "limit": 10,
        "active":True,
    },
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
    {
        "name": "psar_up",
        # DONE
        "condition": "( indicator:1d:0:sar < indicator:1d:0:low ) and ( indicator:1d:-1:sar > indicator:1d:-1:high ) and ( indicator:1d:-2:sar > indicator:1d:-2:high ) and ( indicator:1d:-3:sar > indicator:1d:-3:high )",
        "columns": [],
        "sort_by": "change",
        "limit": 10,
        "active":True,
    },
    {
        "name": "psar_down",
        # DONE
        "condition": "( indicator:1d:0:sar > indicator:1d:0:high ) and ( indicator:1d:-1:sar < indicator:1d:-1:low ) and ( indicator:1d:-2:sar < indicator:1d:-2:low ) and ( indicator:1d:-3:sar < indicator:1d:-3:low )",
        "columns": [],
        "sort_by": "change",
        "limit": 10,
        "active":True,
    },
]
from myapp.core.constant import CACHE_TIMEOUT_1DAY, CACHE_TIMEOUT_30MIN, CACHE_TIMEOUT_5MIN

from myapp.extensions import cache

ENABLED_LIST = [
    "high_volume",
    "high_low_gap",
    "avarage_true_range",
    "normalized_avarage_true_range",
    "top_gainer",
    "top_looser",
    "top_active",
    "only_buyer",
    "only_seller",
    "52_weeks_high",
    "52_weeks_low",
    "overbought",
    "oversold",
    "uptrend_3_days",
    "downtrend_3_days",
    "psar_up",
    "psar_down"
]


@smart_cache(cache_key="summary_result")
def compute_summary():
    "ignore_cache will override the decorator to ignore cache"
    result = {}
    global rules
    for x in rules:
        if not x.get('active'):
            continue
        if x.get('name') not in ENABLED_LIST:
            continue
        ret = dfilter.filterstock(
            condition=x.get('condition'),
            columns=x.get("columns"),
            sort_by=x.get('sort_by'),
            limit=x.get('limit')
        )
        result[x.get('name')] = {"name": x.get('name'), "data": ret}
    return result


def get_summary():
    return dredis.getPickle("summary_result")

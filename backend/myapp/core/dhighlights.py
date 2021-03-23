from myapp.core.dtypes import TCandleType
from myapp.core import dfilter

rules = [
    {
        "name": "Top Over sold",
        "condition": "indicator:1d:0:rsi_14 > 50",  # TODO
        "columns": ["indicator:1d:0:rsi_14"],
        "sort_by": "1d:0:rsi_14",
        "limit": 10,
        "active":True,
    },
    {
        "name": "Top Over bought",
        "condition": "indicator:1d:0:rsi_14 < 50",  # TODO
        "columns": ["indicator:1d:0:rsi_14"],
        "sort_by": "-1d:0:rsi_14",
        "limit": 10,
        "active":True,
    },
    {
        "name": "top Gainer",
        "condition": "true",  # No condition is given
        "sort_by": "change",
        "limit": 10,
        "columns": [],
        "active":False,
    },
    {
        "name": "top Looser",
        "condition": "true",  # No condition is given
        "sort_by": "-change",
        "limit": 10,
        "columns": [],
        "active":False,
    },
    {
        "name": "Top Active(Vol)",
        "condition": "true",  # TODO
        "sort_by": "volume",
        "limit": 10,
        "columns": ["volume"],
        "active":False,
    },
    {
        "name": "Less Active(vol)",
        "condition": "true",  # TODO
        "sort_by": "-volume",
        "limit": 10,
        "columns": [],
        "active":False,
    }
]


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

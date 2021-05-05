from myapp.core.ddecorators import trace_perf
import numpy as np
from myapp.core.RetHelper import fixDict, verifyOrThrow
from myapp.core import dlog
from myapp.core import dglobaldata
from myapp.core import timetracker
from myapp.core.sync import getSymbolList


@trace_perf
def filterstock(condition, columns=[], sort_by: str = None, limit: int = None):
    dlog.d('[INFO] Running scans for condition: {}, columns: {}'.format(
        condition, columns))
    interval_df = dglobaldata.get_all_data()
    result = []
    sl = 0
    offset = -1  # This used by the eval
    columns = [resolveIndicatorExpression(c) for c in columns]
    condition = resolveCondition(condition)
    try:
        for symbol in getSymbolList().keys():
            try:
                if(eval(condition)):
                    sl += 1
                    selected_one = {}
                    selected_one['symbol'] = symbol
                    selected_one['name'] = getSymbolList()[symbol]['name']
                    selected_one['sector'] = getSymbolList()[symbol]['sector']
                    selected_one['close'] = str(np.round(
                        interval_df['1d'][symbol].iloc[-1]['close'], 2))

                    if selected_one['close'] == "nan":
                        timetracker.reportNAN(selected_one)
                        continue

                    selected_one['volume'] = str(
                        interval_df['1d'][symbol].iloc[-1]['volume'])
                    if selected_one['volume'] == "nan":
                        timetracker.reportNAN(selected_one)
                        continue

                    selected_one['change'] = str(
                        interval_df['1d'][symbol].iloc[-1]['close_change_percentage'])
                    if selected_one['change'] == "nan":
                        timetracker.reportNAN(selected_one)
                        continue

                    if columns:
                        for c in columns:
                            if c:
                                selected_one[c[0]] = np.round(
                                    eval(c[1]), 2)
                    # add used defined data
                    result.append(fixDict(selected_one))
            except Exception as e:
                dlog.ex(e)
                dlog.e(
                    "We faced the issue when we are running filter for symbol:"
                    + symbol)
                pass

    except Exception as e:
        raise e
    # Filter None

    # Do sort
    if sort_by:
        sort_key = sort_by.replace("-", "")
        reverse = sort_by[0] != "-"
        result = [x for x in result if x.get(sort_key) is not None]
        result.sort(key=lambda x: float(x.get(sort_key)), reverse=reverse)

    # Do limit
    if limit:
        result = result[:limit]
    return result


def resolveIndicatorExpression(expression: str):
    if not expression:
        return

    # Remove quick ref
    if expression in ['sl', 'close', 'symbol', 'volume', 'name', "change"]:
        if expression == 'close':
            return ('close', "interval_df['1d'][symbol].iloc[-1]['close']")
        elif expression == 'volume':
            return ('volume', "interval_df['1d'][symbol].iloc[-1]['volume']")
        elif expression == 'change':
            return ('change', "interval_df['1d'][symbol].iloc[-1]['close_change_percentage']")
        else:
            return
    indicator_tokens = expression.split(":")
    interval = indicator_tokens[1]  # it can be day, m5, m10, m15
    # Note that we have plus the offset, thus it generates like 0-1, -1-1, -2-1 ...
    offset = '{} + offset'.format(indicator_tokens[2])
    indicator = indicator_tokens[3]
    # indicator_text = "{}[{}] {}".format(indicator_tokens[1], indicator_tokens[2], indicator_tokens[3])
    indicator_text = expression  # Just keep the full expression
    return (indicator_text, 'interval_df["{}"][symbol].iloc[{}]["{}"]'.format(
        interval, offset, indicator))


def resolveCondition(cond: str):
    # Spacial case when you want to skip the condition
    if cond.lower() == "true" or cond == "1":
        return "True"

    # Now process it
    cond = cond.replace("\t", " ")
    cond = cond.replace("\n", " ")
    cond = cond.replace("\r", " ")
    tokens = cond.split(" ")
    processed = []
    for t in tokens:
        t = t.strip()
        if len(t) == 0:
            continue
        if (t in [')', '(', 'and', 'or', ">", "<", ">=", "<=", "+", "-", "*", "/"]):
            processed.append(t)
        elif t.startswith('num#'):
            processed.append(t.replace("num#", ""))
        elif t.startswith("indicator:"):
            # indicator:day:0:ema_50:
            indicator_tokens = t.split(":")
            interval = indicator_tokens[1]  # it can be day, m5, m10, m15
            # Note that we have plus the offset, thus it generates like 0-1, -1-1, -2-1 ...
            offset = '{} + offset'.format(indicator_tokens[2])
            indicator = indicator_tokens[3]
            processed.append('interval_df["{}"][symbol].iloc[{}]["{}"]'.format(
                interval, offset, indicator))
        else:
            processed.append(t)
    return " ".join(processed)


# Test
# print(FilterAPI.getInstance().resolveIndicatorExpression("indicator:1d:0:rsi_14"))
# cond = FilterAPI.getInstance().resolveCondition("indicator:1d:0:close > 10")
# print(FilterAPI.getInstance().filterstock(
#    "indicator:1d:0:close > 10", ["indicator:1d:0:rsi_14", "indicator:1d:0:rsi_6"]))

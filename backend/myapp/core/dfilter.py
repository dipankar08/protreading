import numpy as np
from myapp.core import dlog, dredis, timetracker
from myapp.core.ddecorators import trace_perf
from myapp.core.RetHelper import fixDict
from myapp.core.sync import getSymbolList


def getIndicatorHistory(domain) -> dict:
    indicator_history_key = "indicator_history_{}".format(domain)
    # TODO : CHECK TS for reload
    data = dredis.getPickle(indicator_history_key)
    if not data:
        raise Exception(
            "Indicator History is not yet avlaible for domain:{}".format(domain))
    return data


@trace_perf
def performScreen(domain: str, condition: str, columns=[], sort_by: str = None, limit: int = None):
    dlog.d('[INFO] Running screen for condition: {}, columns: {}'.format(
        condition, columns))
    indicatorHistory = getIndicatorHistory(domain)
    result = []
    sl = 0
    columns = [resolveIndicatorExpression(c) for c in columns]
    condition = resolveCondition(condition)
    last_error = ''
    try:
        for symbol in indicatorHistory.keys():
            indicator_map = indicatorHistory[symbol]
            try:
                if(eval(condition)):
                    sl += 1
                    selected_one = {}
                    selected_one['symbol'] = symbol
                    selected_one['name'] = getSymbolList(domain)[
                        symbol]['name']
                    selected_one['sector'] = getSymbolList(domain)[
                        symbol]['sector']
                    selected_one['close'] = str(
                        np.round(indicator_map['1d'][0]['close'], 2))
                    selected_one['change'] = str(
                        np.round(indicator_map['1d'][0]['close_change_percentage'], 2))
                    # extra col
                    for col in columns:
                        selected_one[col[0]] = str(
                            np.round(eval(col[1]), 2))
                    # add used defined data
                    result.append(fixDict(selected_one))
            except Exception as e:
                last_error = 'Are you passing right Filter {}'.format(
                    condition)
                dlog.ex(e, showStack=False)
                dlog.e(
                    "We faced the issue when we are running filter for symbol:{}".format(symbol))

                # We just ignore this

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
    return {'result': result, 'last_error': last_error}


def resolveIndicatorExpression(expression: str):
    if not expression:
        return
    if expression in ['sl', 'close', 'symbol', 'volume', 'name', "change"]:
        if expression == 'close':
            return ('close', "indicator_map['1d'][0]['close']")
        elif expression == 'volume':
            return ('volume', "indicator_map['1d'][0]['volume']")
        elif expression == 'change':
            return ('change', "indicator_map['1d'][0]['close_change_percentage']")
        else:
            return
    indicator_tokens = expression.split(":")
    return (indicator_tokens[3], 'indicator_map["{}"][{}]["{}"]'.format(
        indicator_tokens[1], indicator_tokens[2], indicator_tokens[3]))


# We resigned the conditions here:

def resolveCondition(cond: str):
    # Spacial case when you want to skip the condition
    try:
        if cond.lower() == "true" or cond == "1":
            return "True"
        tokens = [t.strip() for t in cond.split(" ") if len(t.strip()) > 0]
        converted = []
        for t in tokens:
            if t.startswith('indicator:'):
                indicator_tokens = t.split(":")
                converted.append('indicator_map["{}"][{}]["{}"]'.format(
                    indicator_tokens[1], indicator_tokens[2], indicator_tokens[3]))
            else:
                converted.append(t)
        return " ".join(converted)
    except Exception as e:
        raise Exception(
            "You passed a invalid filter:{} {}".format(cond, e.args))


print(resolveCondition("indicator:1d:0:close > num:10"))
print(resolveCondition("indicator:1d:0:close > indicator:1d:0:close"))
print(resolveCondition("indicator:1d:0:close > num:10"))
print(resolveIndicatorExpression("indicator:1d:0:close"))

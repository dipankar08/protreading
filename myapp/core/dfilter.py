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
    dlog.d("\n\n\n" + "*" * 50 + " NEW FILTER " + "*" * 50)
    dlog.d('[INFO] Running screen for condition: {}, columns: {}'.format(
        condition, columns))
    indicatorHistory = getIndicatorHistory(domain)
    result = []
    sl = 0
    columns = [resolveColumnExpression(c) for c in columns]
    condition = resolveCondition(condition)
    dlog.d('[INFO] Running screen for condition: {}, columns: {}'.format(
        condition, columns))
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
                    selected_one['volume'] = str(
                        np.round(indicator_map['1d'][0]['volume'], 2))
                    selected_one['rsi_14'] = str(
                        np.round(indicator_map['1d'][0]['rsi_14'], 2))
                    selected_one['change'] = str(
                        np.round(indicator_map['1d'][0]['close_change_percentage'], 2))
                    # extra col
                    for col in columns:
                        selected_one[col["name"]] = str(
                            np.round(eval(col["value"]), 2))
                    # add used defined data
                    result.append(fixDict(selected_one))
            except Exception as e:
                dlog.ex(e)
                last_error = 'Are you passing right Filter {} cased by {}'.format(
                    condition, e.args)
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


def resolveColumnExpression(expression: str):
    if not expression:
        return None
    tokens = [x.strip()
              for x in expression.split("=") if len(x.strip()) > 0]
    if len(tokens) != 2:
        raise Exception(
            "invalid Column Expression :<{}> ".format(expression))
    return {"name": tokens[0], "value": convertExpression(tokens[1])}


def convertExpression(exp: str):
    result = []
    for e in exp.split(" "):
        if e.startswith("indicator:"):
            result.append(convertToIndicatorMap(e))
        else:
            result.append(e)
    return " ".join(result)


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
                converted.append(convertToIndicatorMap(t))
            else:
                converted.append(t)
        return " ".join(converted)
    except Exception as e:
        raise Exception(
            "Invalid filter:<{}>. What happened? <{}>".format(cond, e.args[0]))


def convertToIndicatorMap(input: str) -> str:
    try:
        indicator_tokens = [x.strip()
                            for x in input.split(":") if len(x.strip()) > 0]
        if len(indicator_tokens) != 4:
            raise Exception(
                "Invalid Indicator Expession found <{}>".format(input))

        if indicator_tokens[1] not in ['1d', '5m']:
            raise Exception(
                "Invalid Indicator Expession found <{}> make sure we have only 1d or 5m as cancle".format(input))

        if int(indicator_tokens[2]) > 0 or int(indicator_tokens[2]) < -20:
            raise Exception(
                "Invalid Indicator Expession found <{}>. Indicator offset must be between -20 .. 0".format(input))

        return 'indicator_map["{}"][{}]["{}"]'.format(
            indicator_tokens[1], indicator_tokens[2], indicator_tokens[3])
    except Exception as e:
        raise Exception(
            "Invalid Indicator Expession found <{}>, caused by <{}>".format(input, e.args))


print(resolveCondition("indicator:1d:0:close > num:10"))
print(resolveCondition("indicator:1d:0:close > indicator:1d:0:close"))
print(resolveCondition("indicator:1d:0:close > num:10"))
print(resolveColumnExpression("close =  indicator:1d:0:close"))

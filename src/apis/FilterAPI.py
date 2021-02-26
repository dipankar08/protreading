from src.utils.timex import time_this
from src.utils.RetHelper import fixDict, verifyOrThrow
from src.utils.processor import getSymbolIntervalCache, reloadAllData
from src.utils.DataLoopup import DataLookup
from src.config.symbols import symbols


class FilterAPI:
    __instance = None

    @staticmethod
    def getInstance():
        """ Static access method. """
        if FilterAPI.__instance == None:
            FilterAPI()
        return FilterAPI.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if FilterAPI.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            FilterAPI.__instance = self

    def filterstock(self, condition, columns=[]):
        print('[INFO] Running scans for {}'.format((condition)))
        interval_df = DataLookup.getInstance().getAllData()
        result = []
        sl = 0
        offset = -1  # This used by the eval
        columns = [self.resolveIndicatorExpression(c) for c in columns]
        condition = self.resolveCondition(condition)
        try:
            for (symbol, name) in symbols.items():
                try:
                    if(eval(condition)):
                        sl += 1
                        selected_one = {
                            'sl': sl,
                            'name': name,
                            'symbol': symbol,
                            'close': interval_df['1d'][symbol].iloc[-1]['close'],
                            'volume': int(interval_df['1d'][symbol].iloc[-1]['volume']),
                        }
                        # add used defined data
                        for c in columns:
                            if c:
                                selected_one[c[0]] = eval(c[1])
                        result.append(fixDict(selected_one))
                except Exception as e:
                    raise e

        except Exception as e:
            raise Exception("Not able to process scanning:"+str(e.args))

        return result

    def resolveIndicatorExpression(self, expression: str):
        if not expression:
            return
        verifyOrThrow("indicator:")
        indicator_tokens = expression.split(":")
        interval = indicator_tokens[1]  # it can be day, m5, m10, m15
        # Note that we have plus the offset, thus it generates like 0-1, -1-1, -2-1 ...
        offset = '{} + offset'.format(indicator_tokens[2])
        indicator = indicator_tokens[3]
        return (indicator, 'interval_df["{}"][symbol].iloc[{}]["{}"]'.format(
            interval, offset, indicator))

    def resolveCondition(self, cond: str):
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
#cond = FilterAPI.getInstance().resolveCondition("indicator:1d:0:close > 10")
# print(FilterAPI.getInstance().filterstock(
#    "indicator:1d:0:close > 10", ["indicator:1d:0:rsi_14", "indicator:1d:0:rsi_6"]))

from utils.utils import fixDict, verifyOrThrow
from utils.processor import getSymbolIntervalCache, reloadAllData


def filterstock(condition):
    print('[INFO] Running scans for {}'.format((condition)))
    reloadAllData()
    symbolIntervalCache = getSymbolIntervalCache()
    verifyOrThrow(len(symbolIntervalCache) > 0, "Cache is not yet loaded")
    result = []
    sl = 0
    offset = -1  # This used by the eval
    try:
        for symbol in symbolIntervalCache:
            interval_df = symbolIntervalCache[symbol]
            try:
                if(eval(condition)):
                    sl += 1
                    result.append(fixDict({
                        'sl': sl,
                        'symbol': symbol,
                        'name': symbol,  # TODO
                        'close': interval_df['1d'].iloc[-1]['close'],
                        'volume': int(interval_df['1d'].iloc[-1]['volume']),
                        'close_change': interval_df['1d'].iloc[-1]['close_change'],
                        'volume_change': interval_df['1d'].iloc[-1]['volume_change'],
                        'high_low_gap_percentage': interval_df['1d'].iloc[-1]['high_low_gap_percentage'],
                    }))
            except Exception as e:
                raise e

    except Exception as e:
        raise Exception("Not able to process scanning:"+str(e.args))

    return result


def resolveCondition(cond: str):
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
            processed.append('interval_df["{}"].iloc[{}]["{}"]'.format(
                interval, offset, indicator))
        else:
            processed.append(t)
    return " ".join(processed)

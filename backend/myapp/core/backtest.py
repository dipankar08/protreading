from myapp.core.timex import time_this
from myapp.core.processor import getDataForInterval, getSymbolIntervalCache
from myapp.core.RetHelper import buildNotImplemented, getCandleCountForDay, verifyOrThrow


@time_this
def perform_backtest(symbol: str, candle_type: str, duration: str, entry_rule: str, exit_rule: str):
    return
    entry_rule = resolveCondition(entry_rule)
    exit_rule = resolveCondition(exit_rule)
    df = getDataForInterval(candle_type).get(symbol)

    length = getCandleCountForDay(int(duration), candle_type)
    all_data_cache = getSymbolIntervalCache()
    interval_df = all_data_cache[symbol]
    df = interval_df[candle_type]
    df = df.iloc[length * -1:]

    # Start the loop
    pos = 0
    buy_price = 0
    sell_price = 0
    buy_date = ''
    sell_date = ''
    start_offset = 0
    notes = []
    sl = 0
    order_book = []
    for i in df.index:
        offset = i
        if pos == 0 and eval(entry_rule):
            pos = 1
            buy_price = df['close'][i]
            buy_date = df['Date'][i]
            start_offset = i
        elif pos == 1 and eval(exit_rule):
            pos = 0
            sell_price = df['Close'][i]
            sell_date = df['Date'][i]
            sl += 1
            order_book.append({
                'sl': sl,
                'buy_price': buy_price,
                'sell_price': sell_price,
                'buy_date': buy_date,
                'sell_date': sell_date,
                'per_change': (sell_price / buy_price - 1) * 100,
                'cooling_period': i - start_offset
            })
    if pos == 1:
        notes.append(
            "We have an extra buy which is not sold yet. We ignore it to get accuracy of the result")
    return {"order_book": order_book}


import os

import pandas as pd
import sys
import traceback
import io
from pandas.io import parsers
from patterns import patterns
from flask import Flask, render_template, request, Response
from flask_cors import CORS, cross_origin
import yfinance as yf
from symbols import symbols
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from helper import create_figure, filterstock, getDataForInterval, resolveCondition, sample_buy_rule, sample_sell_rule, reloadAllData, download_intra
import asyncio
import talib
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
domain = "rc1.grodok.com"

prod = True
# Snap short API


@app.route('/snapshot')
def snapshot():
    try:
        # daily
        for x in symbols:
            data = yf.download(x+'.NS', start="2018-01-01", end="2021-12-30")
            data.to_csv('datasets/daily/{}.csv'.format(x))
            getDataForInterval("daily", "1")
        # 5 min
        for x in symbols:
            #print(yf.Ticker('TSLA').history(period='7d', interval='1m'))
            data = yf.download(x+'.NS', period='1d', interval='5m')
            data.to_csv('datasets/5m/{}.csv'.format(x))
            getDataForInterval("5m", "1")
        return {
            'status': 'success',
            'msg': 'snapshot taken',
            'out': []
        }
    except Exception as e:
        return {'status': 'error', 'msg': 'Not able to take snapshot', 'out': [], 'help': traceback.format_exc()}


@cross_origin()
@app.route('/screen', methods=['POST', 'GET'])
def Screen():
    result = []
    filter = request.args.get('filter')
    if not filter:
        return {'status': 'error', 'msg': 'Please pass filter using get', 'out': []}
    try:
        evaled_condition = resolveCondition(filter)
        result = filterstock(evaled_condition)
        return {'status': 'success', 'msg': 'Here is the list of Stocks', 'out': result}
    except Exception as e:
        return {'status': 'error', 'msg': 'Not able to perform scanning', 'out': [], 'help': traceback.format_exc()}


@app.route('/snapshot_intra')
def snapshot_intra():
    loop.run_until_complete(download_intra())
    return {
        'status': 'success',
        'msg': 'Sanpshot taken'
    }


@app.route('/chart')
def chartTest():
    fig = create_figure()
    output = io.BytesIO()
    FigureCanvas(fig).print_png(output)
    return Response(output.getvalue(), mimetype='image/png')


@app.route('/sample')
def sample():
    symbol = request.args.get('symbol')

    reload = request.args.get('reload')
    interval = request.args.get('interval')
    if not interval:
        interval = 'daily'
    data = getDataForInterval(interval, reload).get(symbol)
    lastdata = dict(data.iloc[-1])
    return """<div>
                <p>Data</p>
                <pre>{}</pre>
                <p>Last data</p>
                <pre style="width: 500px; white-space: pre-wrap">{} </pre>
            </div >""".format(data.tail(), lastdata)


@app.route('/backtest')
def backtest():
    try:
        symbol = request.args.get('symbol')
        entry_rule = request.args.get('entry_rule')
        exit_rule = request.args.get('exit_rule')
        input = {
            "symbol": symbol,
            "entry_rule": entry_rule,
            "exit_rule": exit_rule
        }
        result = {
            'summary': {},
            'order_book': []
        }
        if (symbol and entry_rule and exit_rule):
            df = getDataForInterval("daily").get(symbol)
            pos = 0
            num = 0
            buy_price = 0
            sell_price = 0
            buy_date = ''
            sell_date = ''
            for i in df.index:
                if sample_buy_rule(df, i) and pos == 0:
                    pos = 1
                    buy_price = df['Close'][i]
                    buy_date = df['Date'][i]

                elif sample_sell_rule(df, i) and pos == 1:
                    pos = 0
                    sell_price = df['Close'][i]
                    sell_date = df['Date'][i]
                    result['order_book'].append({
                        'buy_price': buy_price,
                        'sell_price': sell_price,
                        'buy_date': buy_date,
                        'sell_date': sell_date,
                        'per_change': (sell_price/buy_price - 1)*100
                    })
                # Test Just open
                if(i == df['Open'].count() - 1 and pos == 1):
                    pos = 0
                    sell_price = df['Close'][i]
                    sell_date = df['Date'][i]
                    result['order_book'].append({
                        'buy_price': buy_price,
                        'sell_price': sell_price,
                        'buy_date': buy_date,
                        'sell_date': sell_date,
                        'per_change': (sell_price/buy_price - 1)*100
                    })
    except Exception as e:
        # traceback.print_exception()
        return {'error': str(e)}

    gain = 0
    count_gain = 0
    max_gain = 0
    loss = 0
    count_loss = 0
    max_loss = 0
    totalR = 1
    for oe in result['order_book']:
        if(oe['per_change'] > 0):
            gain += oe['per_change']
            count_gain += 1
            max_gain = max(max_gain, oe['per_change'])
        else:
            loss += oe['per_change']
            count_loss += 1
            max_loss = min(max_loss, oe['per_change'])
        totalR = totalR*((i/100)+1)

    result['summary'] = {
        'gain': gain,
        'count_gain': count_gain,
        'loss': loss,
        'count_loss': count_loss,
        'max_gain': max_gain,
        'max_loss': max_loss,
        'totalR': totalR
    }
    return render_template('backtest.html', result=result, input=input, symbols=symbols)


@app.route('/')
def index():
    pattern = request.args.get('pattern')
    result = []
    if not pattern:
        return render_template('index.html', patterns=patterns, result=result)

    # we have a patterns here
    datafiles = os.listdir('datasets/daily')

    for filename in datafiles:
        symbol = filename.split('.')[0]
        df = pd.read_csv('datasets/daily/{}'.format(filename))
        # print(df)
        pattern_function = getattr(talib, pattern)
        try:
            res = pattern_function(
                df['Open'], df['High'], df['Low'], df["Close"])
            last = res.tail(1).values[0]
            # print(last)
            if last != 0:
                print('{} is triggered'.format(filename))
                result.append({'symbol': symbol, 'value': last})
        except Exception as e:
            print(e)
    return render_template('index.html', patterns=patterns, result=result)


if __name__ == '__main__':
    if prod:
        app.run(host='0.0.0.0', port=5000, debug=False, ssl_context=(
            '/etc/letsencrypt/live/rc1.grodok.com/fullchain.pem', '/etc/letsencrypt/live/rc1.grodok.com/privkey.pem'))
    else:
        app.run(host='localhost', port=5000, debug=True)

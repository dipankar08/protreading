import os

import pandas as pd
import sys
import traceback
import io
from pandas.io import parsers
from patterns import patterns
from flask import Flask, render_template, request, Response
import yfinance as yf
from symbols import symbols
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from helper import create_figure, filterstock, getDailyDataSet, resolveCondition, sample_buy_rule, sample_sell_rule
# Installation is complicated
# brew install ta-lib - pip will give clang error
# export ARCHFLAGS="-arch x86_64"; /usr/bin/python3 -m pip install --user --upgrade psutil
import talib

app = Flask(__name__)


@app.route('/snapshot')
def snapshot():
    for x in symbols:
        data = yf.download(x+'.NS', start="2018-01-01", end="2021-12-30")
        data.to_csv('datasets/daily/{}.csv'.format(x))
        getDailyDataSet()
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


@app.route('/screen')
def Screen():
    result = []
    params = {'condition': ''}
    error = {

    }
    try:
        params['condition'] = request.args.get('condition')
        evaled_condition = resolveCondition(params['condition'])
        result = filterstock(evaled_condition)
    except Exception as e:
        error['msg'] = "Not able to perform scanning..."
        error['stack'] = traceback.format_exc()
    return render_template('screen.html', result=result, params=params, error=error)


@app.route('/sample')
def sample():
    symbol = request.args.get('symbol')
    reload = request.args.get('reload')
    data = getDailyDataSet(reload).get(symbol)
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
            df = getDailyDataSet().get(symbol)
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
    app.run(host='localhost', port=5000)

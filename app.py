import os

import pandas as pd
import io
from pandas.io import parsers
from patterns import patterns
from flask import Flask, render_template, request, Response
import yfinance as yf
from symbols import symbols
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from helper import create_figure, getDailyDataSet
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


@app.route('/sample')
def getSample():
    symbol = request.args.get('symbol')
    reload = request.args.get('reload')
    data = getDailyDataSet(reload).get(symbol)
    return "<div><p>Data</p><pre>{}</pre></div>".format(data.tail())


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

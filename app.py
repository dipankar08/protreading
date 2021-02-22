
from utils.download import download
from utils.screen import resolveCondition, filterstock
import os
from utils.backtest import perform_backtest
from utils.utils import buildError, buildException, buildNotImplemented, buildSuccess, getParamFromRequest
from flask import Flask, helpers, render_template, request, Response
from flask_cors import CORS, cross_origin
import asyncio
import talib
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
domain = "rc1.grodok.com"

prod = False
# Snap short API


@app.route('/status')
def status():
    try:
        return buildSuccess()
    except Exception as e:
        return buildException(e)


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
        return buildSuccess(msg='Here is the list of Stocks', out=result)
    except Exception as e:
        return buildException(e)


@app.route('/snapshot')
def snapshot_intra():
    try:
        requestParam = getParamFromRequest(
            request, ['candle_type', 'duration'])
        result = download(
            requestParam['candle_type'], requestParam['duration'])
        return buildSuccess("fetched the data", result)
    except Exception as e:
        return buildException(e)


@app.route('/backtest')
def backtest():
    try:
        requestParam = getParamFromRequest(
            request, ['symbol', 'candle_type', 'entry_rule', 'exit_rule', 'duration'])
        result = perform_backtest(requestParam['symbol'], requestParam['candle_type'],
                                  requestParam['duration'], requestParam['entry_rule'], requestParam['exit_rule'])
        return buildSuccess("backtest executed successfully", result)
    except Exception as e:
        return buildException(e)


@app.route('/')
def index():
    return buildNotImplemented()
    """
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
    """


if __name__ == '__main__':
    if prod:
        app.run(host='0.0.0.0', port=5000, debug=False, ssl_context=(
            '/etc/letsencrypt/live/rc1.grodok.com/fullchain.pem', '/etc/letsencrypt/live/rc1.grodok.com/privkey.pem'))
    else:
        app.run(host='localhost', port=5000, debug=True)

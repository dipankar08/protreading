from utils.download import DownloadManager
from utils.timex import time_this

from flask.globals import g
from utils.processor import getSampleData
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

timingsprod = False
# Snap short API

# Timing realted works

"""
@app.after_request
def after_request_func(response):
    # just append timings to the output response:
    response.data = json.loads(json.loads(response.data))
    response.data['time'] = g.timings
    response.data = json.dumps(response.data)
    return response
"""


@app.before_request
def before_request_func():
    g.timings = {}


@time_this
def test():
    pass


@app.route('/status')
def status():
    try:
        test()
        return buildSuccess()
    except Exception as e:
        return buildException(e)


@cross_origin()
@app.route('/sample')
def sample():
    try:
        requestParam = getParamFromRequest(
            request, ['symbol', 'columns'])
        result = getSampleData(requestParam.get('symbol'),
                               requestParam.get('columns').split(','))
        return buildSuccess("sample returned", result)
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


@cross_origin()
@app.route('/snapshot')
def snapshot_intra():
    try:
        requestParam = getParamFromRequest(
            request, ['candle_type', 'duration'])
        result = DownloadManager.getInstance().download(
            requestParam['candle_type'], requestParam['duration'])
        return buildSuccess("fetched the data", result)
    except Exception as e:
        return buildException(e)


@cross_origin()
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


@cross_origin()
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


"""
if __name__ == '__main__':
    if prod:
        app.run(host='0.0.0.0', port=5000, debug=False, ssl_context=(
            '/etc/letsencrypt/live/rc1.grodok.com/fullchain.pem', '/etc/letsencrypt/live/rc1.grodok.com/privkey.pem'))
    else:
        app.run(host='localhost', port=5000, debug=True)
"""
# HACK https://stackoverflow.com/questions/33379287/gunicorn-cant-find-app-when-name-changed-from-application
# They need the application name as app
application = app


from src.utils.DataLoopup import DataLookup
from src.config.MyTypes import TCandleType
from src.utils.FastStorage import FastStorage
from src.utils.DownloadManager import DownloadManager
from src.utils.timex import time_this

from flask.globals import g
from src.utils.processor import getSampleData
from src.utils.screen import resolveCondition, filterstock
import os
from src.apis.backtest import perform_backtest
from src.utils.RetHelper import buildError, buildException, buildNotImplemented, buildSuccess, getParamFromRequest
from flask import Flask, helpers, render_template, request, Response
from flask_cors import CORS, cross_origin
import asyncio
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


@app.route('/status')
def status():
    try:
        return buildSuccess()
    except Exception as e:
        return buildException(e)


@cross_origin()
@app.route('/sample')
def sample():
    try:
        requestParam = getParamFromRequest(
            request, ['symbol', 'columns'])
        result = DataLookup.getInstance().getSample(requestParam.get('symbol'),
                                                    requestParam.get('columns').split(','))
        return buildSuccess("sample returned", result)
    except Exception as e:
        return buildException(e)


@ cross_origin()
@ app.route('/screen', methods=['POST', 'GET'])
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


@ cross_origin()
@ app.route('/snapshot')
def snapshot_intra():
    try:
        requestParam = getParamFromRequest(
            request, ['candle_type'])
        result = FastStorage.getInstance().refreshData(
            candle_type=TCandleType(requestParam.get('candle_type')))
        return buildSuccess("fetched the data", result)
    except Exception as e:
        return buildException(e)


@ cross_origin()
@ app.route('/backtest')
def backtest():
    try:
        requestParam = getParamFromRequest(
            request, ['symbol', 'candle_type', 'entry_rule', 'exit_rule', 'duration'])
        result = perform_backtest(requestParam['symbol'], requestParam['candle_type'],
                                  requestParam['duration'], requestParam['entry_rule'], requestParam['exit_rule'])
        return buildSuccess("backtest executed successfully", result)
    except Exception as e:
        return buildException(e)


@ cross_origin()
@ app.route('/')
def index():
    return buildNotImplemented()


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

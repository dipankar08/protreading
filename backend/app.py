
from src.apis.TimeSeriesAPI import TimeSeriesAPI
from src.apis.FilterAPI import FilterAPI
from src.utils.DataLoopup import DataLookup
from src.config.MyTypes import TCandleType
from src.utils.FastStorage import FastStorage
from src.utils.DownloadManager import DownloadManager
from src.utils.timex import time_this
import base64

from flask.globals import g
from src.utils.processor import getSampleData
import os
from src.apis.backtest import perform_backtest
from src.utils.RetHelper import buildError, buildException, buildNotImplemented, buildSuccess, ensureParmasInRequest, ensureProvidedDefaultInRequest, getParamFromRequest
from flask import Flask, helpers, render_template, request, Response
from flask_cors import CORS, cross_origin
import asyncio

from src.utils.PlotApi import buildChartInPng
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
    try:
        ensureParmasInRequest(request, ['filter'])
        ensureProvidedDefaultInRequest(request, {'columns': ""})
        result = []
        result = FilterAPI.getInstance().filterstock(
            request.view_args.get('filter'), request.view_args.get('columns').split(","))
        return buildSuccess(msg='Here is the list of Stocks', out=result)
    except Exception as e:
        return buildException(e)


@ cross_origin()
@ app.route('/relate', methods=['POST', 'GET'])
def Relate():
    try:
        ensureParmasInRequest(request, ["symbol_list", "indicator_list"])
        ensureProvidedDefaultInRequest(request, {'duration': 10})
        ensureProvidedDefaultInRequest(
            request, {'candle_type': TCandleType.DAY_1.value})
        result = []
        result = TimeSeriesAPI.getInstance().getTSData(
            request.view_args.get('symbol_list').split(','),
            request.view_args.get('indicator_list').split(","),
            TCandleType(request.view_args.get('candle_type')),
            request.view_args.get('duration')
        )
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


def get_of_default(obj, key, defl):
    res = obj.get(key)
    if res:
        return res
    else:
        return defl


@ cross_origin()
@ app.route('/chart')
def chart():
    try:
        requestParam = getParamFromRequest(
            request, ['symbol'])
        symbol = requestParam.get('symbol')
        candle_type = get_of_default(request.args, "candle_type", "1d")
        duration = get_of_default(request.args, "duration", "30")

        path = "datasets/screenshot/{}-{}-{}.png".format(
            symbol, candle_type, duration)

        if not os.path.exists(path):
            df = DataLookup.getInstance().getDataFrame(
                symbol, TCandleType(candle_type), int(duration))
            buildChartInPng(symbol, df, path)

        with open(path, "rb") as binary_file:
            binary_file_data = binary_file.read()
            base64_encoded_data = base64.b64encode(binary_file_data)
            base64_message = base64_encoded_data.decode('utf-8')
            return buildSuccess("Image Return", "data:image/png;base64,{}".format(base64_message))

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


from src.apis.TimeSeriesAPI import TimeSeriesAPI
from src.apis.FilterAPI import FilterAPI
from src.utils.DataLoopup import DataLookup
from src.config.MyTypes import TCandleType
from src.utils.FastStorage import FastStorage
from src.utils.DownloadManager import DownloadManager
from src.utils.timex import time_this
from celery import Celery
import base64
import random
import time
from flask import jsonify, url_for
from flask.globals import g
from src.utils.processor import getSampleData
import os
from src.apis.backtest import perform_backtest
from src.utils.RetHelper import buildError, buildException, buildNotImplemented, buildSuccess, ensureParmasInRequest, ensureProvidedDefaultInRequest, getParamFromRequest
from flask import Flask, request
from flask_cors import CORS, cross_origin
import asyncio

from src.utils.PlotApi import buildChartInPng
from src.utils.helper import get_of_default
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
domain = "rc1.grodok.com"

timingsprod = False


@app.before_request
def before_request_func():
    g.timings = {}

#################################################  BEGIN OF ROUTER #############################################################


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


@ cross_origin()
@ app.route('/chart')
def chart():
    try:
        requestParam = getParamFromRequest(
            request, ['symbol'])
        symbol = requestParam.get('symbol')
        candle_type = get_of_default(request.args, "candle_type", "1d")
        duration = get_of_default(request.args, "duration", "30")
        reload = get_of_default(request.args, "reload", "0")

        path = "datasets/cache/screenshot/{}-{}-{}.png".format(
            symbol, candle_type, duration)

        if not os.path.exists(path) or reload == "1":
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


#################################################  BEGIN OF WORKER #############################################################
# Celery configuration
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'
celery = Celery(app.name,
                broker=app.config.get('CELERY_BROKER_URL'),
                include=["app"]
                )
celery.conf.update(app.config)


# This is a sample long running task
@celery.task(bind=True, name="backend.app.long_task")
def long_task(self):
    """Background task that runs a long function with progress reports."""
    verb = ['Starting up', 'Booting', 'Repairing', 'Loading', 'Checking']
    adjective = ['master', 'radiant', 'silent', 'harmonic', 'fast']
    noun = ['solar array', 'particle reshaper', 'cosmic ray', 'orbiter', 'bit']
    message = ''
    total = random.randint(10, 50)
    for i in range(total):
        if not message or random.random() < 0.25:
            message = '{0} {1} {2}...'.format(random.choice(verb),
                                              random.choice(adjective),
                                              random.choice(noun))
        self.update_state(state='PROGRESS',
                          meta={'current': i, 'total': total,
                                'status': message})
        time.sleep(1)
    return {'current': 100, 'total': 100, 'status': 'Task completed!',
            'result': 42}


@app.route('/longtask', methods=['GET'])
def longtask():
    task = long_task.apply_async()
    return buildSuccess("Submitted", {'Location': url_for('taskstatus',
                                                          task_id=task.id)})


@app.route('/status/<task_id>')
def taskstatus(task_id):
    task = long_task.AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {
            'state': task.state,
            'current': 0,
            'total': 1,
            'status': 'Pending...'
        }
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'current': task.info.get('current', 0),
            'total': task.info.get('total', 1),
            'status': task.info.get('status', '')
        }
        if 'result' in task.info:
            response['result'] = task.info['result']
    else:
        # something went wrong in the background job
        response = {
            'state': task.state,
            'current': 1,
            'total': 1,
            'status': str(task.info),  # this is the exception raised
        }
    return jsonify(response)


#################################################  BEGIN OF APP #############################################################
# HACK https://stackoverflow.com/questions/33379287/gunicorn-cant-find-app-when-name-changed-from-application
# They need the application name as app
application = app

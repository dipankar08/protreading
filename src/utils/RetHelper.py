import traceback
from typing import Dict

from flask.globals import g
from src.utils.const import CANDLE_TYPE_COUNT
from flask import app, json, jsonify
import numpy as np
import json as JSON


def returnAsJson(dict):
    return jsonify(json.dumps(dict).replace('NaN', '0'))


def buildSuccess(msg: str = "`Successfully executed", out=None):
    return returnAsJson({'status': 'success', 'msg': msg, 'out': out, "time": g.timings})


def buildError(msg: str, help='No help is given'):
    return returnAsJson({'status': 'error', 'msg': msg, 'out': [], 'help': help})


def buildException(ex: Exception):
    print("\n\n\n"+"*"*100+"\nException found\n"+"*"*100+"\n" +
          traceback.format_exc()+"*"*50+"\n\n\n")
    return returnAsJson({'status': 'error', 'msg': "Some critical error happend in the server:"+str(ex.args), 'out': [], 'help': traceback.format_exc()})


def buildNotImplemented():
    return buildError("This endpoint not yet supported", "Ask Dipankar to implement this feature")


def getParamFromRequest(request, params):
    res = {}
    for v in params:
        if not request.args.get(v):
            raise Exception(
                "Sorry, the request is missing params: {}".format(v))
        res[v] = request.args.get(v)
    return res


def ensureParmasInRequest(request, params):
    for v in params:
        if not request.args.get(v):
            raise Exception(
                "Sorry, the request is missing params: {}".format(v))
        else:
            request.view_args[v] = request.args.get(v)


def ensureProvidedDefaultInRequest(request, params: Dict):
    for (k, v) in params.items():
        if not request.args.get(k):
            request.view_args[k] = v
        else:
            request.view_args[k] = request.args.get(k)


def verifyOrThrow(cond: bool, msg="Assert fails"):
    if not cond:
        raise Exception(
            "internal server error:{}".format(msg))

# How many candle do we have in 180 days or last 6 months.


def getCandleCountForDay(day: int, candle_type):
    return int(day/7*5) * CANDLE_TYPE_COUNT[candle_type]


def fixDict(dict):
    for k in dict.keys():
        if dict[k] == None or dict[k] == np.nan:
            print('fixing null value', dict[k])
            dict[k] = 'Unknown'
    return dict


def fixRound(data):
    return np.round(data, 2)

import time
from myapp.core.dnetwork import ping_backend
import traceback
from typing import Dict

from flask.globals import g
from flask import app, json, jsonify
import numpy as np
import json as JSON
#from myapp.core.dglobaldata import _last_update_ts
from myapp.core import timetracker
CANDLE_TYPE_COUNT = []
from flask import jsonify


def addExtraInfo(dict):
    return dict


def returnAsJson(dict):
    data = addExtraInfo(dict)
    return jsonify(data)


def buildSuccess(msg: str = "`Successfully executed", out=None):
    ping_backend()
    return returnAsJson({'status': 'success', 'msg': msg, 'out': out, "time": 'Deleted'})


def buildError(msg: str, help='No help is given'):
    ping_backend()
    return returnAsJson({'status': 'error', 'msg': msg, 'out': [], 'help': help})


def buildException(ex: Exception):
    print("\n\n\n" + "*" * 100 + "\nException found\n" + "*" * 100 + "\n" +
          traceback.format_exc() + "*" * 50 + "\n\n\n")
    return returnAsJson({'status': 'error', 'msg': "Some critical error happend in the server:" + str(ex.args), 'out': [], 'help': traceback.format_exc()})


def buildNotImplemented():
    return buildError("This endpoint not yet supported", "Ask Dipankar to implement this feature")


def verifyOrThrow(cond: bool, msg="Assert fails"):
    if not cond:
        raise Exception(
            "internal server error:{}".format(msg))

# How many candle do we have in 180 days or last 6 months.


def getCandleCountForDay(day: int, candle_type):
    return int(day / 7 * 5) * CANDLE_TYPE_COUNT[candle_type]


def fixDict(dict):
    for k in dict.keys():
        if dict[k] is None or dict[k] == np.nan:
            print('fixing null value', dict[k])
            dict[k] = 'Unknown'
    return dict


def fixRound(data):
    return np.round(data, 2)

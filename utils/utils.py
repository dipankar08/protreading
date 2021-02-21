import traceback
from utils.const import CANDLE_TYPE_COUNT


def buildSuccess(msg: str = "`Successfully executed", out=None):
    return {'status': 'success', 'msg': msg, 'out': out}


def buildError(msg: str, help='No help is given'):
    return {'status': 'error', 'msg': msg, 'out': [], 'help': help}


def buildException(ex: Exception):
    return {'status': 'error', 'msg': "Some issue happens in the server", 'out': [], 'help': traceback.format_exc()}


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


def verifyOrThrow(cond: bool, msg="Assert fails"):
    if not cond:
        raise Exception(
            "internal server error:{}".format(msg))

# How many candle do we have in 180 days or last 6 months.


def getCandleCountForDay(day: int, candle_type):
    return int(day/7*5) * CANDLE_TYPE_COUNT[candle_type]

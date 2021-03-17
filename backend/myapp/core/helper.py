from flask.wrappers import Request


def getParamFromRequest(request, params):
    res = {}
    for v in params:
        if not request.args.get(v):
            raise Exception(
                "Sorry, the request is missing params: {}".format(v))
        res[v] = request.args.get(v)
    return res


def get_of_default(obj, key, defl):
    res = obj.get(key)
    if res:
        return res
    else:
        return defl


def get_param_or_throw(request: Request, key):
    res = request.args.get(key)
    if res:
        return res
    else:
        raise Exception("You must send a `{}` with the request".format(key))

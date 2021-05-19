import pickle
import time
from types import FunctionType

from myapp.core import dlog
from myapp.core.dtypes import TCandleType
from redis import Redis

_redis = Redis()


def set(key, value):
    dlog.d("Setting Key is redis :{}".format(key))
    _redis.set(key, value)


def get(key, defl: str = None):
    "just return as a string"
    if _redis.get(key):
        return _redis.get(key).decode('ascii')
    else:
        return defl


def getraw(key):
    return _redis.get(key)


def clear(key):
    _redis.delete(key)


def hasKey(key):
    return _redis.get(key) is not None


def setPickle(key: str, value: dict):
    set(key, pickle.dumps(value))


def getPickle(key: str, defl=None):
    data = getraw(key)
    if data:
        return pickle.loads(data)
    else:
        return defl


def clearAll():
    _redis.flushall()


# test
#set("hello", "1")
#print(get("hello") == "1")


# Aplication

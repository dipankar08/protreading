from myapp.core.dtypes import TCandleType
from types import FunctionType
from redis import Redis
import time
import pickle
_redis = Redis()


def set(key, value):
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

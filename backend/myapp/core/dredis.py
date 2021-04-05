from myapp.core.dtypes import TCandleType
from types import FunctionType
from redis import Redis
import time
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


# test
set("hello", "1")
print(get("hello") == "1")


# Aplication

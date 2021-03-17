from types import FunctionType
from redis import Redis
_redis = Redis()


def set(key, value):
    _redis.set(key, value)


def get(key):
    "just return as a string"
    if _redis.get(key):
        return _redis.get(key).decode('ascii')
    else:
        return None


def getraw(key):
    return _redis.get(key)


def clear(key):
    _redis.delete(key)


# test
set("hello", "1")
print(get("hello") == "1")

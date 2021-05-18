import time
from datetime import date, datetime, timedelta
from functools import wraps

from flask.globals import g


def time_this(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        r = func(*args, **kwargs)
        end = time.time()
        time.sleep(1)
        g.timings[func.__name__] = "{} mili sec".format(
            round((end - start) * 1000, 2))
        return r
    return wrapper


# Get current time in String in ISO format
def getCurTimeStr() -> str:
    dateObj = datetime.now()
    dateStr = dateObj.strftime("%Y-%m-%dT%H:%M:%SZ")
    return dateStr


# convert a string date into Obj
def getTimeObj(dateStr) -> date:
    return datetime.strptime(dateStr, "%Y-%m-%dT%H:%M:%SZ")


# Check if a given time is 5 min older
def IfTimeIs5MinOld(dateStr) -> bool:
    if dateStr is None:
        return False
    return getTimeObj(dateStr) < datetime.now() - timedelta(minutes=5)

import time
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
            round((end-start)*1000, 2))
        return r
    return wrapper

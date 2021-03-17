"""
A simple execution time logger implemented as a python decorator.
Available under the terms of the MIT license.
"""

import time

from functools import wraps
from myapp.core.DLogger import DLogger


def timed(func):
    """This decorator prints the execution time for the decorated function."""

    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        DLogger.getInstance().d("{} ran in {}s".format(
            func.__name__, round(end - start, 2)))
        return result

    return wrapper


""""
UNIT TEST
@timed
def slow_function():
    print("running a slow function...", end="")
    time.sleep(3.2)
    print("done")

# slow_function()

"""

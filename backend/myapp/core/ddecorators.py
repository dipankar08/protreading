from myapp.core import dlog
from myapp.core import RetHelper
import time


def make_exception_safe(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            dlog.ex("Unknown error in the server", e)
            return RetHelper.buildException(e)
    wrapper.__name__ = func.__name__
    return wrapper


def trace_perf(func):
    def wrapper(*arg):
        t = time.time()
        dlog.d("\n\n>>>>>>>>>>>>>>>> STARTING {} <<<<<<<<<<<<<".format(
            func.__name__))
        res = func(*arg)
        dlog.d("\n>>>>>>>>>>>>>>>> ENDING {}, Time taken: {} sec <<<<<<<<<<<<<\n\n".format(
            func.__name__, time.time() - t))
        return res

    return wrapper


def log_func(func):
    "Just log entry and exit point"
    def wrapper(*arg):
        t = time.time()
        dlog.d("\n\n>>>>>>>>>>>>>>>> STARTING {} <<<<<<<<<<<<<".format(
            func.__name__))
        res = func(*arg)
        dlog.d("\n>>>>>>>>>>>>>>>> ENDING {}, Time taken: {} sec <<<<<<<<<<<<<\n\n".format(
            func.__name__, time.time() - t))
        return res

    return wrapper


def dump_args(func):
    "This decorator dumps out the arguments passed to a function before calling it"
    argnames = func.__code__.co_varnames[:func.__code__.co_argcount]
    fname = func.__name__

    def echo_func(*args, **kwargs):
        return
        # This lines is wrong
        print(fname + "(" + ', '.join(
            '%s=%r' % entry
            for entry in zip(argnames, args[:len(argnames)]) + [("args", list(args[len(argnames):]))] + [("kwargs", kwargs)]) + ")")
    return echo_func

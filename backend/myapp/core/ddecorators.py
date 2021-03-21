import functools
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
    def wrapper(*args, **kwargs):
        t = time.time()
        dlog.d("\n\n>>>>>>>>>>>>>>>> STARTING {} <<<<<<<<<<<<<".format(
            func.__name__))
        res = func(*args, **kwargs)
        dlog.d("\n>>>>>>>>>>>>>>>> ENDING {}, Time taken: {} sec <<<<<<<<<<<<<\n\n".format(
            func.__name__, time.time() - t))
        return res
    wrapper.__name__ = func.__name__
    return wrapper


def log_func(remote_logging=False):
    def actual_decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            t = time.time()
            func_name = func.__name__
            if remote_logging:
                dlog.remote(func_name, "function {} started".format(func_name))
            dlog.d("\n\n>>>>>>>>>>>>>>>> STARTING {} <<<<<<<<<<<<<".format(
                func.__name__))
            res = func(*args, **kwargs)
            dlog.d("\n>>>>>>>>>>>>>>>> ENDING {}, Time taken: {} sec <<<<<<<<<<<<<\n\n".format(
                func.__name__, time.time() - t))
            if remote_logging:
                dlog.remote(func_name, "function {} ended ( time taken: {} )".format(
                    func_name, time.time() - t))
            return res
        return wrapper
    return actual_decorator


def log_decorator(log_enabled):
    def actual_decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            if log_enabled:
                print("Calling Function: " + func.__name__)
            return func(*args, **kwargs)
        return wrapper
    return actual_decorator


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

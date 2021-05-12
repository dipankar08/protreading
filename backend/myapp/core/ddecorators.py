import functools
from myapp.core import dlog
from myapp.core import RetHelper
import time
from myapp.core import dredis
from myapp.core import danalytics


def make_exception_safe(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            dlog.ex(e, "Unknown error in the server")
            danalytics.reportException(e)
            return RetHelper.buildException(e)
    wrapper.__name__ = func.__name__
    return wrapper


def decrTaskCommonAction(func):
    def wrapper(*args, **kwargs):
        func_name = func.__name__
        try:
            danalytics.reportAction("worker_task_start_{}".format(func_name))
            ret = func(*args, **kwargs)
            danalytics.reportAction("worker_task_success_{}".format(func_name))
            return ret
        except Exception as e:
            dlog.ex(e, "Unknown error in the server")
            danalytics.reportAction(
                "worker_task_exception_{}".format(func_name))
            danalytics.reportException(e)
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


def decrTLogFunction(remote_logging=False):
    def actual_decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            t = time.time()
            func_name = func.__name__
            if remote_logging:
                danalytics.reportAction(func_name + "_started")
            dlog.d("\n\n>>>>>>>>>>>>>>>> STARTING {} <<<<<<<<<<<<<".format(
                func.__name__))
            res = func(*args, **kwargs)
            dlog.d("\n>>>>>>>>>>>>>>>> ENDING {}, Time taken: {} sec <<<<<<<<<<<<<\n\n".format(
                func.__name__, time.time() - t))
            if remote_logging:
                danalytics.reportAction(func_name + "_ended")
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


import pickle


def smart_cache(cache_key: str):
    """ This is extramly smart caching with multi worker support 
    The cache use the redis cache. This function ensure
    - default caching over lifetime
    - override ignore caching by passing function params.
    - define timestamp when cache will expair.
    " The cache will store in redis - we will call picket to serialize"
    " please pass params like ignore_cache = true to ignore caching"""
    def actual_decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            print(args)
            print(kwargs)
            func_name = func.__name__

            cache_key_loading = "{}_loading".format(cache_key)
            cache_key_ts = "{}_ts".format(cache_key)
            # Check if cache exist.
            if kwargs.get('ignore_cache') != True:
                cache = dredis.getPickle(cache_key, None)
                if cache:
                    return cache
            # Check global lock
            if dredis.get(cache_key_loading) == "1":
                raise Exception(
                    "{} is locked by smart cache".format(func_name))
            # Lock
            dredis.set(cache_key_loading, "1")
            # We need to use try catch to avoid unlock
            res = None
            try:
                # Execute
                res = func(*args, **kwargs)
                dredis.setPickle(cache_key, res)
                dredis.set(cache_key_ts, time.time())
            except Exception as e:
                dlog.ex(e, "exception happened while executing:{}".format(func_name))
                pass
            # Unlock
            dredis.set(cache_key_loading, "0")
            return res
        return wrapper
    return actual_decorator


def ensure_single_entry(cache_key: str):
    def actual_decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            print(args)
            print(kwargs)
            func_name = func.__name__
            cache_key_loading = "{}_loading".format(cache_key)
            if dredis.get(cache_key_loading) == "1":
                raise Exception(
                    "{} is already in progress".format(func_name))
            # Lock
            dredis.set(cache_key_loading, "1")
            # We need to use try catch to avoid unlock
            res = None
            try:
                # Execute
                res = func(*args, **kwargs)
            except Exception as e:
                dlog.ex(e, "exception happened while executing:{}".format(func_name))
                pass
            # Unlock
            dredis.set(cache_key_loading, "0")
            return res
        return wrapper
    return actual_decorator

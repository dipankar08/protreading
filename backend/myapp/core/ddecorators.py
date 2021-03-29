import functools
from myapp.core import dlog
from myapp.core import RetHelper
import time
from myapp.core import dredis


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
                cache = dredis.getraw(cache_key)
                if cache:
                    # TODO CHECK Cache expaire
                    return pickle.loads(cache)
            # Check global lock
            if dredis.get(cache_key_loading) == "1":
                raise Exception(
                    "{} is locked by smart cache".format(func_name))
            # Lock
            dredis.set(cache_key_loading, "1")
            # We need to use try catch to avoid unlock
            try:
                # Execute
                res = func(*args, **kwargs)
                dredis.set(cache_key, pickle.dumps(res))
                dredis.set(cache_key_ts, time.time())
            except Exception as e:
                dlog.ex("exception happened while executing:{}".format(func_name), e)
                pass
            # Unlock
            dredis.set(cache_key_loading, "0")

            return res
        return wrapper
    return actual_decorator

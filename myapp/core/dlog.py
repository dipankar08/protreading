# pyright: strict
import logging
import traceback

# setup logger
__logger = logging.getLogger(__name__)
__logger.setLevel("DEBUG")
handler = logging.StreamHandler()
log_format = "[%(asctime)s][%(levelname)s] %(message)s"
formatter = logging.Formatter(log_format)
handler.setFormatter(formatter)
__logger.addHandler(handler)


def stack():
    print("*" * 100)
    traceback.print_stack(limit=5)
    print("*" * 100)


def d(msg: str):
    __logger.info("[DEBUG] {}".format(msg))


def s(msg: str):
    __logger.debug(msg)
    __logger.info("[SUCCESS] {}".format(msg))


def e(msg: str):
    __logger.error(msg)
    __logger.info("[ERROR] {}".format(msg))


def ex(e: Exception, msg: str = "Exception:", showStack: bool = True):
    __logger.error(
        "[EXCEPTION START] == == == == == == == == == == == == == {} - {}  == == == == == == == == == == == == ==".format(msg, e.args))
    if showStack:
        __logger.exception("{} - {}".format(msg, e.args), e)
    __logger.error(
        "[EXCEPTION END] == == == == == == == == == == == == == == == == == == == == == == == == == == ")

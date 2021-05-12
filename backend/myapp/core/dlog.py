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
    __logger.debug(msg)


def e(msg: str):
    __logger.error(msg)


def ex(e: Exception, msg: str = "Exception:"):
    __logger.error("{} - {}".format(msg, e.args))
    __logger.exception("{} - {}".format(msg, e.args), e)

# pyright: strict
import logging
from typing import Dict
from myapp.core.constant import APP_ID, SIMPLESTORE_ENDPOINT
from myapp.core.dnetwork import simplestore_post
import traceback
# setup logger
__logger = logging.getLogger(__name__)
__logger.setLevel("DEBUG")
handler = logging.StreamHandler()
log_format = "[%(asctime)s][%(levelname)s] %(message)s"
formatter = logging.Formatter(log_format)
handler.setFormatter(formatter)
__logger.addHandler(handler)


session: str = ''


def init():
    global session
    if session != '':
        return
    try:
        data: dict = simplestore_post(
            url="{}/api/analytics/launch".format(SIMPLESTORE_ENDPOINT),
            data={"app_id": APP_ID, "app_version": "1.0", "device_os": "web", "device_id": "null", "device_api": "null"})
        session = data.get('out')[0].get('session')
        d("Remote log is inited with session:{}".format(session))
    except:
        pass


def stack():
    print("*" * 100)
    traceback.print_stack(limit=5)
    print("*" * 100)


def d(msg: str):
    __logger.debug(msg)


def e(msg: str):
    __logger.error(msg)


def ex(msg: str, e: Exception):
    __logger.exception(msg, e)


def remote(tag: str, msg: str, extra: Dict = {}):
    d("Remote called....")
    simplestore_post(
        url="{}/api/analytics/action".format(SIMPLESTORE_ENDPOINT),
        data={"app_id": APP_ID, "session": session,
              "tag": tag, "msg": msg, "extra": extra}
    )

# setup logs

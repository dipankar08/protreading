
import traceback
from myapp.core import dlog
from myapp.core.constant import APP_ID, SIMPLESTORE_ENDPOINT
from myapp.core.dnetwork import simplestore_get, simplestore_post
from myapp.core.helper import isDebug


session: str = ''


def init():
    if isDebug():
        dlog.d("ignore remote log in debug mode")
        return
    global session
    if session != '':
        dlog.d("Already session exist")
        return
    try:
        data: dict = simplestore_post(
            url="{}/api/analytics/launch".format(SIMPLESTORE_ENDPOINT),
            data={"app_id": APP_ID, "app_version": "1.0", "device_os": "web",
                  "device_id": "null", "device_api": "null"})
        session = data.get('out')[0].get('session')
        dlog.d("Remote log is inited with session:{}".format(session))
    except Exception as ex:
        dlog.ex(e=ex)
        pass


def reportException(ex: Exception, location=""):
    if isDebug():
        dlog.d("ignore remote log in debug mode")
        return
    try:
        res = simplestore_post(
            url="{}/api/analytics/exception".format(SIMPLESTORE_ENDPOINT),
            data={"app_id": APP_ID, "session": session,
                  "location": traceback.format_exc().split("\n")[-4].strip(), "type": "exception",
                  "stack": traceback.format_exc(), "args": str(ex.args)}
        )
        dlog.d(str(res))
    except Exception as ex:
        dlog.ex(ex)


def reportAction(tag: str, extra: dict = {}):
    dlog.d("logging remore action with tag:" + tag)
    if isDebug():
        dlog.d("ignore remote log in debug mode")
        return
    try:
        simplestore_post(
            url="{}/api/analytics/action".format(SIMPLESTORE_ENDPOINT),
            data={"app_id": APP_ID, "session": session,
                  "tag": tag, "extra": extra}
        )
    except Exception as ex:
        dlog.ex(ex)

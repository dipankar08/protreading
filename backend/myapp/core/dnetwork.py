from myapp.core.helper import isDebug
import requests
from json import loads
# from myapp.core import dlog << cercular deps
import datetime


def simplestore_get(url: str) -> dict:
    print("Calling GET:${}".format(url))
    data = requests.get(url)
    jsonData = loads(data.content)
    if jsonData.get('status') != 'success':
        print("{} ==> {}".format(url, str(jsonData)))
        raise Exception("simplestore_get fails for {}".format(url))
    return jsonData


def simplestore_post(url: str, data: dict, silent=True) -> dict:
    print("Calling POST:${}".format(url))
    data1 = requests.post(url, json=data)
    jsonData = loads(data1.content)
    if jsonData.get('status') != 'success':
        print("{} ==> {}".format(url, str(jsonData)))
        raise Exception("simplestore_get fails for {}".format(url))
    return jsonData


def ping(name, endpoint):
    simplestore_get(
        "https://simplestore.dipankar.co.in/api/status/ping?name={}&endpoint={}".format(name, endpoint))


# Infra for report the ping
ping_celery_ts = datetime.datetime(2012, 3, 5, 23, 8, 15)
ping_backend_ts = datetime.datetime(2012, 3, 5, 23, 8, 15)


def ping_celery():
    if isDebug():
        # Donot track the ping from debug
        return
    global ping_celery_ts
    if (datetime.datetime.now() - ping_celery_ts).total_seconds() < 60 * 60:
        return
    ping_celery_ts = datetime.datetime.now()
    ping(name="PROTREADING-WORKER", endpoint="null")


def ping_backend():
    if isDebug():
        # Donot track the ping from debug
        return
    global ping_backend_ts
    if (datetime.datetime.now() - ping_backend_ts).total_seconds() < 60 * 60:
        return
    ping_backend_ts = datetime.datetime.now()
    ping(name="PROTREADING-FLASK", endpoint="https://dev.api.grodok.com:5000")
# test
# print(simplestore_get("https://api.grodok.com/api/test"))
# print(simplestore_post("https://api.grodok.com/api/test", {}))

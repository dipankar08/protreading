import requests
from json import loads
from myapp.core import dlog


def simplestore_get(url: str) -> dict:
    data = requests.get(url)
    print(data)
    jsonData = loads(data.content)
    if jsonData.get('status') != 'success':
        dlog.d("{} ==> {}".format(url, str(jsonData)))
        raise Exception("simplestore_get fails for {}".format(url))
    return jsonData


def simplestore_post(url: str, data: dict, silent=True) -> dict:
    data = requests.post(url, json=data)
    jsonData = loads(data.content)
    if jsonData.get('status') != 'success':
        dlog.d("{} ==> {}".format(url, str(jsonData)))
        raise Exception("simplestore_get fails for {}".format(url))
    return jsonData


# test
# print(simplestore_get("https://rc1.grodok.com/api/test"))
# print(simplestore_post("https://rc1.grodok.com/api/test", {}))

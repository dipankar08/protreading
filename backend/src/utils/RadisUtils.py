from types import FunctionType
from redis import Redis


class RadisUtils:
    __instance = None
    __redis: Redis = None

    @staticmethod
    def getInstance():
        """ Static access method. """
        if RadisUtils.__instance == None:
            RadisUtils()
        return RadisUtils.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if RadisUtils.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            RadisUtils.__instance = self
            self._redis = Redis()

    def set(self, key, value):
        self._redis.set(key, value)

    def get(self, key):
        return self._redis.get(key)

    def subscribe(self, key, event_handler: FunctionType):
        pass
# TEST


def test():
    r = RadisUtils.getInstance()

    def callback(msg):
        print(msg)
    #r.subscribe("key", callback)
    r.set("key", "value")
    print(r.get("key"))


test()

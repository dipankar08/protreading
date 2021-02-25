import pickle
from typing import Any, Dict


class KeyValueStore:
    __instance = None
    __store: Dict[str, Any] = {}

    @staticmethod
    def getInstance():
        """ Static access method. """
        if KeyValueStore.__instance == None:
            KeyValueStore()
        return KeyValueStore.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if KeyValueStore.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            KeyValueStore.__instance = self
            try:
                with open('kv.pkl', 'rb') as handle:
                    self.__store = pickle.load(handle)
            except:
                self.__store = {}

    def put(self, key: str, value: Any):
        self.__store[key] = value
        # You might not do that always..
        with open('kv.pkl', 'wb') as handle:
            pickle.dump(self.__store, handle, protocol=pickle.HIGHEST_PROTOCOL)

    def get(self, key: str) -> Any:
        return self.__store.get(key)

# Unit Test
# KeyValueStore.getInstance().put("hello", "hello")
# print(KeyValueStore.getInstance().get("hello"))

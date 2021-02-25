
import logging


class DLogger:
    __instance = None
    __logger: logging.Logger = logging.getLogger(__name__)

    @staticmethod
    def getInstance():
        """ Static access method. """
        if DLogger.__instance == None:
            DLogger()
        return DLogger.__instance

    def __init__(self):
        """ Virtually private constructor. """
        if DLogger.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            DLogger.__instance = self
            __logger = logging.getLogger(__name__)
            # Misc logger setup so a debug log statement gets printed on stdout.
            __logger.setLevel("DEBUG")
            handler = logging.StreamHandler()
            log_format = "[%(asctime)s][%(levelname)s] %(message)s"
            formatter = logging.Formatter(log_format)
            handler.setFormatter(formatter)
            __logger.addHandler(handler)

    def d(self, msg: str):
        self.__logger.debug(msg)


# Unit Test
# DLogger.getInstance().d("Hello")

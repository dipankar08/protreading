import os

from flask import Flask

from myapp.controllers.sample import home
from myapp.controllers.core_api import core_api
from myapp.factories.configuration import Config


def create_application() -> Flask:
    """
    Basic application configuration
    :return: Flask App instance
    """
    app = Flask(__name__,
                template_folder=os.path.join(Config.MODULE_DIR, 'templates'))
    app.config.from_object(Config)
    app.register_blueprint(home)
    app.register_blueprint(core_api)
    return app

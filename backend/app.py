import os
from myapp.factories.application import create_application
from myapp.factories.celery import configure_cache, configure_celery
from myapp.core import dlog
from myapp.core import danalytics

# Start the process here
# Application should be a global name as ut used by VS code.
application = create_application()
configure_celery(application)
configure_cache(application)
danalytics.init()
danalytics.reportAction("boot_complate")


def run():
    flask_host = os.environ.get('FLASK_HOST', '127.0.0.1')
    application.run(host=flask_host, debug=True)


if __name__ == '__main__':
    run()

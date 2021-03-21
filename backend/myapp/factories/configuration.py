import os
from celery.schedules import crontab


class Config:
    MODULE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    PROJECT_DIR = os.path.dirname(MODULE_DIR)
    DEBUG = False
    TESTING = False

    # Celery
    CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL',
                                       'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.environ.get('CELERY_BACKEND',
                                           'redis://localhost:6379/1')
    CELERY_ACCEPT_CONTENT = ['json', 'yaml']
    CELERY_TASK_SERIALIZER = 'json'
    CELERY_RESULT_SERIALIZER = 'json'
    CELERY_IMPORTS = ('myapp.tasks',)
    CELERY_TASK_RESULT_EXPIRES = 30
    CELERY_WORKER_HIJACK_ROOT_LOGGER = False
    CELERY_TIMEZONE = 'UTC'
    CELERYBEAT_SCHEDULE = {
        # 'test-celery': {
        #    'task': 'tasks.print',
        #    'schedule': crontab(),
        # },

        'test-celery': {
            'task': 'tasks.code_api.plot_chart_all',
            # Run everyday after treading stop
            'schedule': crontab(hour=10, minute=10),  # tested
        },
        # At the end of the day update the 1D data
        'snapshot-1d': {
            'task': 'tasks.code_api.snapshot',
            'args': {"1d": '1d'},  # Not sure the right way to pass the params
            # Run everyday after treading stop
            # this needs to fix
            'schedule': crontab(hour=10, minute=5),
        },

        # At end of each min, update the 5 min data
        'snapshot-5min': {
            'task': 'tasks.code_api.snapshot',
            'args': {"5m": '5m'},  # Not sure the right way to pass the params
            # Run everyday after treading stop
            # this needs to fix
            'schedule': crontab(minute="*/5", day_of_week="mon-fri", hour="3-10"),
            # Testing
            # 'schedule': crontab(minute="*/1", day_of_week="sun-mon", hour="0-23"),
        },
    }

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
            'schedule': crontab(hour=10, minute=5),  # tested
        },
        'snapshot-5min': {
            'task': 'tasks.code_api.snapshot',
            'args': '5m',
            # Run everyday after treading stop
            # this needs to fix
            # 'schedule': crontab(minute="*/5", day_of_week="mon-fri", hour="3-10"),
            # Testing
            'schedule': crontab(minute="*/5", day_of_week="sun-mon", hour="14-15"),
        },
    }

"""
Module for importing non-configured flask extensions
"""
from celery import Celery
from flask_caching import Cache

celery = Celery('celery_example', include=['myapp.tasks'])
cache = Cache(config={
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "redis",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
})

#pipenv run celery -A myapp.worker.celery worker

#start beat too
pipenv run celery -A myapp.worker.celery worker -l info --beat

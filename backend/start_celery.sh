
# Clear older pending task
pipenv run celery  -A myapp.worker.celery purge -f
#pipenv run celery -A myapp.worker.celery worker

#start beat too
#pipenv run celery  -A myapp.worker.celery worker -l info --beat

pipenv run celery  -A myapp.worker.celery worker -l info --beat -f celery.log

 #pipenv run celery  -A myapp.worker.celery inspect active
# pipenv run celery  -A myapp.worker.celery inspect scheduled
#https://gist.github.com/amatellanes/a986f6babb9cf8556e36
pipenv run celery  -A myapp.worker.celery events

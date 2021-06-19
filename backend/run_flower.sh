echo "open menu at http://localhost:5555/tasks" 
pipenv run celery -A myapp.worker.celery flower

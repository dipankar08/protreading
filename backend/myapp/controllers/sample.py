from myapp.core.RetHelper import buildSuccess
from flask import Blueprint, render_template, Response, request
from myapp import tasks
from myapp.extensions import celery
home = Blueprint('home_views', __name__)


@home.route('/', methods=['GET', 'POST'])
def index() -> Response:
    task_id = None
    if request.method == 'POST':
        task_id = tasks.simple_task.delay(request.form.get('message'))
    return buildSuccess("task submitted", {"status_url": "/result/{}".format(task_id)})


@home.route('/result/<task_id>')
def task_result(task_id):
    result = celery.AsyncResult(task_id)
    resultdata = None
    if result.info:
        resultdata = result.info
    return buildSuccess("task submitted", {"state": result.state, "task_id": result.task_id, "result": resultdata})

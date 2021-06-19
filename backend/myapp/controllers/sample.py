from flask import Blueprint, Response, render_template, request
from myapp import tasks
from myapp.core.RetHelper import buildError, buildSuccess
from myapp.extensions import celery

home = Blueprint('home_views', __name__)


@home.route('/', methods=['GET', 'POST'])
def index() -> Response:
    return buildSuccess("not supported")


@home.route('/result/<task_id>')
def task_result(task_id):
    result = celery.AsyncResult(task_id)
    if result:
        if type(result.info) is Exception:
            return buildError("Task failed due to exception:{}".format(str(result.info.args)))
        else:
            return buildSuccess("task submitted", {"state": result.state, "task_id": result.task_id, "result": str(result.info)})
    return buildError("Some issue happened")

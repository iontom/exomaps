from flask import Flask, Blueprint
from flask_socketio import SocketIO
from redis import Redis
# from . import app_controller


main = Blueprint('main', __name__)
app = Flask(__name__,
            template_folder='../templates',
            static_folder='../static')
# app.debug = debug
app.register_blueprint(main)
socketio = SocketIO(app, async_mode=None)
redis = Redis(host='redis', port=6379)
#socketio.init_app(app)
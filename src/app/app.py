import os
import pandas as pd
import mimetypes

from redis import Redis
from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, send
from flask_bootstrap import Bootstrap
# from flask_migrate import Migrate
# from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from py import main, app, socketio, redis
from py.app_controller import SceneBuilder as sb
from threading import Timer, Lock

app = Flask(__name__)
socket_ = SocketIO(app, async_mode=None)

mimetypes.add_type('application/javascript', '.mjs')

thread = None
thread_lock = Lock()
# socketio = SocketIO(app, async_mode=None)
# redis = Redis(host='redis', port=6379)

database_uri = 'postgresql+psycopg2://{dbuser}:{dbpass}@{dbhost}:{dbport}/{dbname}'.format(
    dbuser=os.environ['DBUSER'],
    dbpass=os.environ['DBPASS'],
    dbhost=os.environ['DBHOST'],
    dbname=os.environ['DBNAME'],
    dbport=os.environ['DBPORT']
)
db = create_engine(database_uri)


# tpath = '/code/src/app/templates'
# app = Flask(__name__, template_folder='./templates')

@app.route('/')
@app.route('/index')
def home():
    scene_data = [{'foo': [1, 2, 3, 4], 'fee': 'hello'}]
    # scene = sb(app, scene_data)

    df = pd.read_sql_query("""
                    SELECT
                    sri.﻿sys_id AS star_id,
                    sri.sys_code,
                    sri.main_id
                    FROM dm_galaxy.star_render_info sri
                    ORDER BY distance ASC
                    LIMIT 20
                           """,
                           con=db,
                           index_col='star_id')
    # df.set_index(0)
    df.index.name = None

    # return df.to_html()
    print('debug')
    table_out = df.to_html().replace('class="dataframe"', 'class="table table-striped"')
    #print(table_out)

    return render_template('home.html', title='Space!', df_table=table_out)

# flask stuff
@app.route("/viewer")
def viewer():
    return render_template("viewer.html")

@app.route("/gui")
def gui():
    scene_data = [{'foo': [1, 2, 3, 4], 'fee': 'hello'}]
    return render_template("gui.html")

@socket_.on('message', namespace='/starmap')
def handle_message(msg):
    print('Session: ' + request.sid)
    print('Message: ' + msg)
    #send(msg, broadcast=True)

    # Socket connected! Let's stream the stars!
    df = pd.read_sql_query("""SELECT 
    size, r, g, b, x, y, z
    FROM dm_galaxy.star_render_info
    ORDER BY distance ASC
    LIMIT 100
    """,
                           con=db)
    print(df)

    if msg == 'connected':
        emit('from_flask', 'recieved!', broadcast=True)

        # size, x, y, z, r, g, b
        for index, row in df.iterrows():
            emit('make_star', row.tolist(), broadcast=True)

        # emit('run_buffer', 'stars', broadcast=True)

# @socket_.on('my_event', namespace='/starmap')
# @socket_.route('/starmap')
# def echo_socket(ws):
#     while True:
#         message = ws.receive()
#         ws.send(message[::-1])


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
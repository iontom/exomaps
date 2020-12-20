from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit
from threading import Lock
import sys
import numpy as np
import json

from . import main, app, socketio, redis

# socketio = None


# ====================================#
# Class: SceneBuilder                 #
# Importance is to construct ThreeJS  #
#=====================================#
class SceneBuilder(object):

    def __init__(self, data):
        self.params = None
        self.updateParams = False
        self.camera = None
        self.updateCamera = False
        self.controls = None
        self.updateControls = False
        # self.socketio = socket
        self.thread = None
        self.thread_lock = Lock()
        # Delta Seconds between scene updates
        self.seconds = 0.01
        self.async_mode = None

        self.data_json = json.dumps(data)
        # socketio = socket

    # this will pass to the viewer every "seconds"
    def background_thread(self):
        """Example of how to send server generated events to clients."""
        #global params, updateParams, camera, updateCamera, controls, updateControls
        while True:
            self.socketio.sleep(self.seconds)
            if (self.updateParams):
                print("========= params:", self.params)
                self.socketio.emit('update_params', self.params, namespace='/test')
            if (self.updateCamera):
                self.socketio.emit('update_camera', self.camera, namespace='/test')
            if (self.updateControls):
                self.socketio.emit('update_controls', self.controls, namespace='/test')
            self.updateParams = False
            self.updateCamera = False
            self.updateControls = False


scene_data = [{'foo': [1, 2, 3, 4], 'fee': 'hello'}]
scene1 = SceneBuilder(scene_data)

# testing the connection
@socketio.on('connection_test', namespace='/starmap')
def connection_test(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('connection_response', {'data': message['data'], 'count': session['receive_count']})

# sending data
@socketio.on('input_data_request', namespace='/test')
def input_data_request(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('input_data_response', scene1.data_json)

# will receive data from gui (and print to console as a test within "from_gui")
@socketio.on('gui_input', namespace='/test')
def gui_input(message):
    # global params, updateParams
    scene1.updateParams = True
    scene1.params = message
    print('changed params', message)
    emit('from_gui', message)

# will receive data from camera
@socketio.on('camera_input', namespace='/test')
def camera_input(message):
    # global camera, updateCamera
    scene1.updateCamera = True
    scene1.camera = message

# will receive data from controls
@socketio.on('controls_input', namespace='/test')
def controls(message):
    # global controls, updateControls
    scene1.updateControls = True
    scene1.controls = message

# the background task sends data to the viewer
@socketio.on('connect', namespace='/test')
def from_gui():
    # global thread
    with scene1.thread_lock:
        if scene1.thread is None:
            scene1.thread = socketio.start_background_task(target=scene1.background_thread)

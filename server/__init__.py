# server/__init__.py

from flask import Flask
from flask_cors import CORS
from server.config.config import *

def create_app():

    # Create app
    app = Flask(__name__)

    # Configure app
    app.config.from_object('server.Config')

    # Enable CORS
    CORS(app, resources={r'/*': {'origins': '*'}})

    # Blueprint for non-auth parts of app
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
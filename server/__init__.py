# __init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_cors import CORS
from server.config import *

db = SQLAlchemy()
mail = Mail()

def create_app():

    # Create app
    app = Flask(__name__)

    # Configure app
    app.config.from_object('server.DevelopmentConfig')

    # Initialize the components
    db.init_app(app)
    mail.init_app(app)

    from .models import User
    with app.app_context():
        db.create_all()

    # Enable CORS
    CORS(app, resources={r'/*': {'origins': '*'}})

    # Blueprint for auth routes in our app
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    # Blueprint for non-auth parts of app
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
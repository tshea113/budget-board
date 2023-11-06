# main.py

from flask import Blueprint, render_template, abort, jsonify, request
from . import db
from jinja2 import TemplateNotFound

main = Blueprint('main', __name__)

@main.route('/')
@main.route('/dashboard')
def index():
    try:
        return render_template('index.html')
    except TemplateNotFound:
        abort(404)
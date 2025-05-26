from flask import Flask
from app.extensions import db, jwt, bcrypt
from app.resources import register_routes
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    register_routes(app)

    with app.app_context():
        db.create_all()

    return app
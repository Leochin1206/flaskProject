from flask import Flask
from app.extensions import db, jwt, bcrypt
from flask_cors import CORS
from app.resources import register_routes
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'chave_default_para_dev')
 
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    CORS(app)

    register_routes(app)

    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
app = create_app()
app.run(debug=True)
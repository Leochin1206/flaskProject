from flask import Flask
from flask_cors import CORS
from app.extensions import db, jwt, bcrypt
import os

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'chave_default_para_dev')
 
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    CORS(app)

    from app.auth import auth_bp
    from app.resources.usuario_routes import usuario_bp
    from app.resources.transacao_routes import transacao_bp
    from app.resources.meta_routes import meta_bp
    from app.resources.configuracao_routes import configuracao_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(usuario_bp, url_prefix='/usuario')
    app.register_blueprint(transacao_bp, url_prefix='/transacao')
    app.register_blueprint(meta_bp, url_prefix='/meta')
    app.register_blueprint(configuracao_bp, url_prefix='/configuracao')

    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

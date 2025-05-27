# app/__init__.py

from flask import Flask, render_template
from flask_cors import CORS
from app.extensions import db, jwt, bcrypt
import os

def create_app():
    app = Flask(__name__)  # Flask vai procurar templates/ e static/ dentro da pasta app automaticamente

    # Configurações
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'chave_default_para_dev')

    # Inicializa extensões
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    # Blueprints
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

    # Rotas de frontend
    @app.route('/')
    def login_page():
        return render_template('login.html')


    @app.route('/cadastro')
    def cadastro_page():
        return render_template('cadastro.html')
    
    @app.route('/home')
    def home():
        return render_template('home.html')

    # Cria o banco de dados, se necessário
    with app.app_context():
        db.create_all()

    return app

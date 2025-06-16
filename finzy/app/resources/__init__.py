from flask import Blueprint
from app.resources.usuario_routes import usuario_bp
from app.resources.transacao_routes import transacao_bp
from app.resources.configuracao_routes import configuracao_bp
from app.resources.meta_routes import meta_bp
from app.auth.routes import auth_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(usuario_bp, url_prefix='/usuarios')
    app.register_blueprint(transacao_bp, url_prefix='/transacoes')
    app.register_blueprint(configuracao_bp, url_prefix='/configuracoes')
    app.register_blueprint(meta_bp, url_prefix='/metas')

from app.extensions import db
from datetime import datetime

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    telefone = db.Column(db.String(20))
    senha = db.Column(db.String(128))
    nivel = db.Column(db.String(20), default='comum')
    data_criacao = db.Column(db.Date, default=datetime.utcnow)
from app.extensions import db
from datetime import datetime

class Transacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(50))
    valor = db.Column(db.Integer)
    categoria = db.Column(db.String(50))
    data = db.Column(db.Date)
    descricao = db.Column(db.String(255))
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    data_criacao = db.Column(db.Date, default=datetime.utcnow)
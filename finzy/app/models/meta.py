from app.extensions import db
from datetime import datetime

class Meta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100))
    descricao = db.Column(db.String(255))
    categoria = db.Column(db.String(50))
    valor_atual = db.Column(db.Float)
    valor_objetivo = db.Column(db.Float)
    data_limite = db.Column(db.Date)
    data_criacao = db.Column(db.Date, default=datetime.utcnow)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id'))
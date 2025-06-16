from app.models.transacao import Transacao
from app.extensions import db
from datetime import datetime

class TransacaoService:

    @staticmethod
    def listar_todos():
        return Transacao.query.all()

    @staticmethod
    def buscar_por_id(id):
        return Transacao.query.get(id)

    @staticmethod
    def criar(data):
        t = Transacao(
            tipo=data['tipo'],
            valor=data['valor'],
            categoria=data['categoria'],
            data=data['data'],
            descricao=data.get('descricao'),
            id_usuario=data['id_usuario'],
            data_criacao=datetime.utcnow()
        )
        db.session.add(t)
        db.session.commit()
        return t

    @staticmethod
    def atualizar(id, data):
        t = Transacao.query.get(id)
        if not t:
            return None
        for key, value in data.items():
            setattr(t, key, value)
        db.session.commit()
        return t

    @staticmethod
    def deletar(id):
        t = Transacao.query.get(id)
        if not t:
            return False
        db.session.delete(t)
        db.session.commit()
        return True
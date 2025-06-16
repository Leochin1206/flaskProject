from app.models.meta import Meta
from app.extensions import db
from datetime import datetime

class MetaService:

    @staticmethod
    def listar_todos():
        return Meta.query.all()

    @staticmethod
    def buscar_por_id(id):
        return Meta.query.get(id)

    @staticmethod
    def criar(data):
        m = Meta(
            nome=data['nome'],
            descricao=data.get('descricao'),
            categoria=data['categoria'],
            valor_objetivo=data['valor_objetivo'],
            data_limite=data['data_limite'],
            data_criacao=datetime.utcnow(),
            id_transacao=data.get('id_transacao'),
            id_usuario=data['id_usuario']
        )
        db.session.add(m)
        db.session.commit()
        return m

    @staticmethod
    def atualizar(id, data):
        m = Meta.query.get(id)
        if not m:
            return None
        for key, value in data.items():
            setattr(m, key, value)
        db.session.commit()
        return m

    @staticmethod
    def deletar(id):
        m = Meta.query.get(id)
        if not m:
            return False
        db.session.delete(m)
        db.session.commit()
        return True
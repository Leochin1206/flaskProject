from app.models.configuracao import Configuracao
from app.extensions import db
from datetime import datetime

class ConfiguracaoService:

    @staticmethod
    def listar_todos():
        return Configuracao.query.all()

    @staticmethod
    def buscar_por_id(id):
        return Configuracao.query.get(id)

    @staticmethod
    def criar(data):
        c = Configuracao(
            id_usuario=data['id_usuario']
        )
        db.session.add(c)
        db.session.commit()
        return c

    @staticmethod
    def atualizar(id, data):
        c = Configuracao.query.get(id)
        if not c:
            return None
        for key, value in data.items():
            setattr(c, key, value)
        db.session.commit()
        return c

    @staticmethod
    def deletar(id):
        c = Configuracao.query.get(id)
        if not c:
            return False
        db.session.delete(c)
        db.session.commit()
        return True
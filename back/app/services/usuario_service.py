from app.models.usuario import Usuario
from app.extensions import db
from datetime import datetime

class UsuarioService:

    @staticmethod
    def listar_todos():
        return Usuario.query.all()

    @staticmethod
    def buscar_por_id(id):
        return Usuario.query.get(id)

    @staticmethod
    def criar(data):
        user = Usuario(
            nome=data['nome'],
            email=data['email'],
            telefone=data.get('telefone'),
            senha=data['senha'],  # Já deve vir hash
            nivel=data.get('nivel', 'comum'),
            data_criacao=datetime.utcnow()
        )
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def atualizar(id, data):
        user = Usuario.query.get(id)
        if not user:
            return None
        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()
        return user

    @staticmethod
    def deletar(id):
        user = Usuario.query.get(id)
        if not user:
            return False
        db.session.delete(user)
        db.session.commit()
        return True
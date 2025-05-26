from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.transacao import Transacao

class TransacaoSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Transacao
        load_instance = True
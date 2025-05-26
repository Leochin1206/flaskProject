from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.configuracao import Configuracao

class ConfiguracaoSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Configuracao
        load_instance = True
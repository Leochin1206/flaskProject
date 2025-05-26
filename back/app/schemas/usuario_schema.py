from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.usuario import Usuario

class UsuarioSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Usuario
        load_instance = True
        exclude = ("senha",)
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.meta import Meta

class MetaSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Meta
        load_instance = True
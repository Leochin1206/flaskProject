from flask import Blueprint, request, jsonify
from app.models.meta import Meta
from app.extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime

meta_bp = Blueprint('meta', __name__)

@meta_bp.route('/', methods=['GET'])
@jwt_required()
def list_metas():
    return jsonify([{k: v for k, v in m.__dict__.items() if k != '_sa_instance_state'} for m in Meta.query.all()])

@meta_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_meta(id):
    m = Meta.query.get_or_404(id)
    return jsonify({k: v for k, v in m.__dict__.items() if k != '_sa_instance_state'})

@meta_bp.route('/', methods=['POST'])
@jwt_required()
def create_meta():
    data = request.json
    print("Recebido:", data)

    if "data_limite" in data:
        data["data_limite"] = datetime.strptime(data["data_limite"], "%Y-%m-%d").date()
    if "data_criacao" in data:
        data["data_criacao"] = datetime.strptime(data["data_criacao"], "%Y-%m-%d").date()

    try:
        m = Meta(**data)
        db.session.add(m)
        db.session.commit()
    except Exception as e:
        print("Erro ao salvar no banco:", e)
        return jsonify({'error': 'Erro interno ao salvar meta'}), 500
    
    return jsonify({'msg': 'Meta criada com sucesso', 'id': m.id}), 201

@meta_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_meta(id):
    data = request.json
    m = Meta.query.get_or_404(id)

    if "data_limite" in data:
        data["data_limite"] = datetime.strptime(data["data_limite"], "%Y-%m-%d").date()
    if "data_criacao" in data:
        data["data_criacao"] = datetime.strptime(data["data_criacao"], "%Y-%m-%d").date()

    for k, v in data.items():
        setattr(m, k, v)

    db.session.commit()
    return jsonify({k: v for k, v in m.__dict__.items() if k != '_sa_instance_state'})

@meta_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_meta(id):
    m = Meta.query.get_or_404(id)
    db.session.delete(m)
    db.session.commit()
    return jsonify({'msg': 'Meta deletada com sucesso'})
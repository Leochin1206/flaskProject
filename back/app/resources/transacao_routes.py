from flask import Blueprint, request, jsonify
from app.models.transacao import Transacao
from app.extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime


transacao_bp = Blueprint('transacao', __name__)

@transacao_bp.route('/', methods=['GET'])
@jwt_required()
def list_transacoes():
    return jsonify([{k: v for k, v in t.__dict__.items() if k != '_sa_instance_state'} for t in Transacao.query.all()])

@transacao_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_transacao(id):
    t = Transacao.query.get_or_404(id)
    return jsonify({k: v for k, v in t.__dict__.items() if k != '_sa_instance_state'})

@transacao_bp.route('/', methods=['POST'])
@jwt_required()
def create_transacao():
    data = request.json

    # Converte strings para date se existirem
    if "data" in data:
        data["data"] = datetime.strptime(data["data"], "%Y-%m-%d").date()
    if "data_criacao" in data:
        data["data_criacao"] = datetime.strptime(data["data_criacao"], "%Y-%m-%d").date()

    t = Transacao(**data)
    db.session.add(t)
    db.session.commit()
    return jsonify({'msg': 'Transação criada com sucesso'})


@transacao_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_transacao(id):
    data = request.json

    # Converte strings para date se existirem
    if "data" in data:
        data["data"] = datetime.strptime(data["data"], "%Y-%m-%d").date()
    if "data_criacao" in data:
        data["data_criacao"] = datetime.strptime(data["data_criacao"], "%Y-%m-%d").date()

    t = Transacao.query.get_or_404(id)
    for k, v in data.items():
        setattr(t, k, v)
    db.session.commit()
    return jsonify({'msg': 'Transação atualizada com sucesso'})

@transacao_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_transacao(id):
    t = Transacao.query.get_or_404(id)
    db.session.delete(t)
    db.session.commit()
    return jsonify({'msg': 'Transação deletada com sucesso'})
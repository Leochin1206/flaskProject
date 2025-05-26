from flask import Blueprint, request, jsonify
from app.models.configuracao import Configuracao
from app.extensions import db
from flask_jwt_extended import jwt_required

configuracao_bp = Blueprint('configuracao', __name__)

@configuracao_bp.route('/', methods=['GET'])
@jwt_required()
def list_configuracoes():
    return jsonify([{k: v for k, v in c.__dict__.items() if k != '_sa_instance_state'} for c in Configuracao.query.all()])

@configuracao_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_configuracao(id):
    c = Configuracao.query.get_or_404(id)
    return jsonify({k: v for k, v in c.__dict__.items() if k != '_sa_instance_state'})

@configuracao_bp.route('/', methods=['POST'])
@jwt_required()
def create_configuracao():
    data = request.json
    c = Configuracao(**data)
    db.session.add(c)
    db.session.commit()
    return jsonify({'msg': 'Configuração criada com sucesso'}), 201

@configuracao_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_configuracao(id):
    data = request.json
    c = Configuracao.query.get_or_404(id)
    for k, v in data.items():
        setattr(c, k, v)
    db.session.commit()
    return jsonify({'msg': 'Configuração atualizada com sucesso'})

@configuracao_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_configuracao(id):
    c = Configuracao.query.get_or_404(id)
    db.session.delete(c)
    db.session.commit()
    return jsonify({'msg': 'Configuração deletada com sucesso'})
from flask import Blueprint, request, jsonify
from app.models.usuario import Usuario
from app.extensions import db
from app import bcrypt
from flask_jwt_extended import jwt_required

usuario_bp = Blueprint('usuario', __name__)

@usuario_bp.route('/', methods=['GET'])
@jwt_required()
def list_usuarios():
    return jsonify([{k: v for k, v in u.__dict__.items() if k != '_sa_instance_state'} for u in Usuario.query.all()])

@usuario_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_usuario(id):
    usuario = Usuario.query.get_or_404(id)
    return jsonify({
        'id': usuario.id,
        'nome': usuario.nome,
        'email': usuario.email,
        'telefone': usuario.telefone,
        'nivel': usuario.nivel,
        'data_criacao': usuario.data_criacao.isoformat() if usuario.data_criacao else None
    }), 200

@usuario_bp.route('/', methods=['POST'])
def create_usuario():
    data = request.json
    senha_plain = data.pop('senha')  # tira a senha do dict original
    senha_hash = bcrypt.generate_password_hash(senha_plain).decode('utf-8')  # gera hash e decodifica para string
    u = Usuario(**data, senha=senha_hash)
    db.session.add(u)
    db.session.commit()
    return jsonify({'msg': 'Usuário criado com sucesso', 'id': u.id}), 201


@usuario_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_usuario(id):
    data = request.json
    u = Usuario.query.get_or_404(id)
    for k, v in data.items():
        setattr(u, k, v)
    db.session.commit()
    return jsonify({'msg': 'Usuário atualizado com sucesso'})

@usuario_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_usuario(id):
    u = Usuario.query.get_or_404(id)
    db.session.delete(u)
    db.session.commit()
    return jsonify({'msg': 'Usuário deletado com sucesso'})
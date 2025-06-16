from flask import Blueprint, request, jsonify
from app.models.usuario import Usuario
from app.extensions import db
from app import bcrypt
from flask_jwt_extended import jwt_required
from werkzeug.security import check_password_hash, generate_password_hash

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
    senha_plain = data.pop('senha')  
    senha_hash = bcrypt.generate_password_hash(senha_plain).decode('utf-8')  
    u = Usuario(**data, senha=senha_hash)
    db.session.add(u)
    db.session.commit()
    return jsonify({'msg': 'Usuário criado com sucesso', 'id': u.id}), 201


@usuario_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_usuario(id):
    data = request.get_json() 
    if not data:
        return jsonify({"error": "Requisição inválida, corpo JSON esperado.", "msg": "Requisição inválida."}), 400

    usuario = Usuario.query.get_or_404(id)
    senha_para_verificacao = data.pop('senha_atual_verificacao', None) 

    if not senha_para_verificacao:
        return jsonify({"error": "O campo 'senha_atual_verificacao' é obrigatório.",
                        "msg": "Por favor, forneça sua senha atual para salvar as alterações."}), 400

    if not bcrypt.check_password_hash(usuario.senha, senha_para_verificacao):
        return jsonify({"error": "Senha atual incorreta.",
                        "msg": "A senha atual fornecida está incorreta."}), 401 

    campos_permitidos_para_atualizacao = ['nome', 'email', 'telefone']
    campos_atualizados = False

    for campo in campos_permitidos_para_atualizacao:
        if campo in data: 
            novo_valor = data[campo]
            if getattr(usuario, campo) != novo_valor:
                setattr(usuario, campo, novo_valor)
                campos_atualizados = True
    
    if campos_atualizados:
        try:
            db.session.commit()
            return jsonify({'msg': 'Usuário atualizado com sucesso!'}), 200
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao commitar no banco: {e}")
            return jsonify({'error': 'Erro ao salvar as alterações no banco de dados.', 
                            'msg': 'Não foi possível salvar as alterações. Tente novamente.'}), 500
    else:
        return jsonify({'msg': 'Nenhum dado foi modificado.'}), 200

@usuario_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_usuario(id):
    u = Usuario.query.get_or_404(id)
    db.session.delete(u)
    db.session.commit()
    return jsonify({'msg': 'Usuário deletado com sucesso'})
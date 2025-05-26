from flask import request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.auth import auth_bp
from app.extensions import db, bcrypt
from app.models.usuario import Usuario


@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    data = request.get_json()
    if not data or not data.get('email') or not data.get('senha'):
        return jsonify({'msg': 'Email e senha são obrigatórios'}), 400

    if Usuario.query.filter_by(email=data['email']).first():
        return jsonify({'msg': 'Email já cadastrado'}), 409

    hashed_password = bcrypt.generate_password_hash(data['senha']).decode('utf-8')
    user = Usuario(
        nome=data.get('nome'),
        email=data['email'],
        telefone=data.get('telefone'),
        senha=hashed_password,
        nivel=data.get('nivel', 'comum')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'Usuário criado com sucesso'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('senha'):
        return jsonify({'msg': 'Email e senha são obrigatórios'}), 400

    user = Usuario.query.filter_by(email=data['email']).first()
    if not user or not bcrypt.check_password_hash(user.senha, data['senha']):
        return jsonify({'msg': 'Credenciais inválidas'}), 401

    token = create_access_token(
    identity=str(user.id),
    additional_claims={"nivel": user.nivel}
)

    return jsonify({'token': token}), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    identity = get_jwt_identity()
    user = Usuario.query.get(identity['id'])
    if not user:
        return jsonify({'msg': 'Usuário não encontrado'}), 404
    return jsonify({
        'id': user.id,
        'nome': user.nome,
        'email': user.email,
        'telefone': user.telefone,
        'nivel': user.nivel,
        'data_criacao': user.data_criacao.isoformat()
    })

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Com JWT stateless, logout pode ser tratado no frontend removendo o token,
    # ou você pode implementar blacklist se quiser.
    return jsonify({'msg': 'Logout realizado'}), 200
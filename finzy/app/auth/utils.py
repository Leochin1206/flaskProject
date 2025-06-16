from flask_jwt_extended import get_jwt_identity
from functools import wraps
from flask import jsonify

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        if not identity or identity.get('nivel') != 'admin':
            return jsonify({'msg': 'Apenas administradores têm acesso'}), 403
        return fn(*args, **kwargs)
    return wrapper

def get_current_user_id():
    identity = get_jwt_identity()
    if identity:
        return identity.get('id')
    return None
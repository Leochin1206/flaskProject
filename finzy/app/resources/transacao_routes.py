from flask import Blueprint, request, jsonify
from app.models.transacao import Transacao
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, date

transacao_bp = Blueprint('transacao', __name__)

@transacao_bp.route('/get', methods=['GET'])
@jwt_required()
def list_transacoes():
    user_id = get_jwt_identity()
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')
    query = Transacao.query.filter_by(id_usuario=user_id)

    if start_date_str and end_date_str:
        try:
            if start_date_str.endswith('Z'):
                start_date_str = start_date_str[:-1] + '+00:00'
            start_date_aware = datetime.fromisoformat(start_date_str)

            if end_date_str.endswith('Z'):
                end_date_str = end_date_str[:-1] + '+00:00'
            end_date_aware = datetime.fromisoformat(end_date_str)

            start_date_naive_utc = start_date_aware.replace(tzinfo=None)
            end_date_naive_utc = end_date_aware.replace(tzinfo=None)
            query = query.filter(Transacao.data >= start_date_naive_utc, Transacao.data <= end_date_naive_utc)
            
        except ValueError:
            return jsonify({"error": "Formato de data inválido. Use o formato ISO 8601 (YYYY-MM-DDTHH:MM:SS.sssZ)."}), 400
        except Exception as e:
            print(f"Erro ao processar datas: {e}") 
            return jsonify({"error": "Erro interno ao processar as datas."}), 500

    query = query.order_by(Transacao.data.desc())
    transacoes = query.all()
    result = []
    for t in transacoes:
        transacao_serializada = {}
        for key, value in t.__dict__.items():
            if key == '_sa_instance_state': 
                continue
            if isinstance(value, datetime) or isinstance(value, date):
                transacao_serializada[key] = value.isoformat() 
            else:
                transacao_serializada[key] = value
        result.append(transacao_serializada)
        
    return jsonify(result)

@transacao_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_transacao(id):
    t = Transacao.query.get_or_404(id)
    return jsonify({k: v for k, v in t.__dict__.items() if k != '_sa_instance_state'})


@transacao_bp.route('/post', methods=['POST'])
@jwt_required()
def create_transacao():
    data = request.json
    user_id = get_jwt_identity()  

    try:
        data['valor'] = float(data.get('valor', 0))
        if 'data' in data:
            data['data'] = datetime.strptime(data['data'], "%Y-%m-%d").date()
    except (ValueError, TypeError) as e:
        return jsonify({'error': 'Erro de formatação nos dados', 'details': str(e)}), 400

    try:
        t = Transacao(
            tipo=data['tipo'],
            valor=data['valor'],
            categoria=data['categoria'],
            data=data['data'],
            descricao=data['descricao'],
            id_usuario=user_id 
        )
        db.session.add(t)
        db.session.commit()
        return jsonify({'msg': 'Transação criada com sucesso'})
    except Exception as e:
        return jsonify({'error': 'Erro ao criar transação', 'details': str(e)}), 422



@transacao_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_transacao(id):
    try:
        data = request.json
        if "data" in data:
            if data["data"]:
                try:
                    data["data"] = datetime.strptime(data["data"], "%Y-%m-%d").date()
                except ValueError:
                    return jsonify({"msg": "Formato de data inválido"}), 400
            else:
                # Remover o campo se estiver vazio
                data.pop("data")
        t = Transacao.query.get_or_404(id)
        for k, v in data.items():
            setattr(t, k, v)

        db.session.commit()
        return jsonify({'msg': 'Transação atualizada com sucesso'})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500



@transacao_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_transacao(id):
    t = Transacao.query.get_or_404(id)
    db.session.delete(t)
    db.session.commit()
    return jsonify({'msg': 'Transação deletada com sucesso'})
from app.tests.utils import criar_usuario_e_token

def test_meta_crud(client, app):
    user_id, headers = criar_usuario_e_token(client, app)

    # Para meta, precisamos criar uma transação para o FK
    res_tr = client.post("/meta/", json={
        "tipo": "saida",
        "valor": 200,
        "categoria": "lazer",
        "data": "2025-05-26",
        "descricao": "Cinema",
        "id_usuario": user_id
    }, headers=headers)
    assert res_tr.status_code == 201
    transacao_id = res_tr.get_json()["id"]

    # Criar meta
    res_post = client.post("/meta", json={
        "nome": "Meta 1",
        "descricao": "Descrição da meta",
        "categoria": "lazer",
        "valor_objetivo": 500.0,
        "data_limite": "2025-12-31",
        "data_criacao": "2025-05-26",
        "id_transacao": transacao_id,
        "id_usuario": user_id
    }, headers=headers)
    assert res_post.status_code == 201
    meta_id = res_post.get_json()["id"]

    # Obter meta
    res_get = client.get(f"/meta/{meta_id}", headers=headers)
    assert res_get.status_code == 200

    # Atualizar meta
    res_put = client.put(f"/meta/{meta_id}", json={"nome": "Meta Atualizada"}, headers=headers)
    assert res_put.status_code == 200
    assert res_put.get_json()["nome"] == "Meta Atualizada"

    # Deletar meta
    res_del = client.delete(f"/meta/{meta_id}", headers=headers)
    assert res_del.status_code == 200

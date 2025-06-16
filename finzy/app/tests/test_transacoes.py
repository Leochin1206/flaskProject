from app.tests.utils import criar_usuario_e_token

def test_transacao_crud(client, app):
    user_id, headers = criar_usuario_e_token(client, app)

    # Criar transação
    res_post = client.post("/transacao/", json={
        "tipo": "entrada",
        "valor": 100,
        "categoria": "salario",
        "data": "2025-05-26",
        "descricao": "Salário mensal",
        "id_usuario": user_id
    }, headers=headers)
    assert res_post.status_code == 201
    transacao_id = res_post.get_json()["id"]

    # Obter transação
    res_get = client.get(f"/transacao/{transacao_id}", headers=headers)
    assert res_get.status_code == 200

    # Atualizar transação
    res_put = client.put(f"/transacao/{transacao_id}", json={"valor": 150}, headers=headers)
    assert res_put.status_code == 200
    assert res_put.get_json()["valor"] == 150

    # Deletar transação
    res_del = client.delete(f"/transacao/{transacao_id}", headers=headers)
    assert res_del.status_code == 200

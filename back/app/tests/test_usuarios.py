from app.tests.utils import criar_usuario_e_token

def test_usuario_crud(client, app):
    user_id, headers = criar_usuario_e_token(client, app)

    # Obter usuário criado
    res_get = client.get(f"/usuario/{user_id}", headers=headers)
    print("Resposta GET usuário:", res_get.get_json())
    assert res_get.status_code == 200
    data = res_get.get_json()
    print(data)
    assert data["id"] == user_id

    # Atualizar usuário
    res_put = client.put(f"/usuario/{user_id}", json={"nome": "Novo Nome"}, headers=headers)
    assert res_put.status_code == 200
    assert res_put.get_json()["nome"] == "Novo Nome"

    # Deletar usuário
    res_del = client.delete(f"/usuario/{user_id}", headers=headers)
    assert res_del.status_code == 200

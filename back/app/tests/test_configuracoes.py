from app.tests.utils import criar_usuario_e_token

def test_configuracao_crud(client, app):
    user_id, headers = criar_usuario_e_token(client, app)

    # Criar configuração
    res_post = client.post("/configuracao/", json={
        "id_usuario": user_id
    }, headers=headers)

    print(res_post.data.decode())  # Veja a mensagem do erro
    assert res_post.status_code == 201
    config_id = res_post.get_json()["id"]

    # Obter configuração
    res_get = client.get(f"/configuracao/{config_id}", headers=headers)
    assert res_get.status_code == 200

    # Atualizar configuração (se aplicável, ajustar conforme seu modelo)
    res_put = client.put(f"/configuracao/{config_id}", json={"id_usuario": user_id}, headers=headers)
    assert res_put.status_code == 200

    # Deletar configuração
    res_del = client.delete(f"/configuracao/{config_id}", headers=headers)
    assert res_del.status_code == 200

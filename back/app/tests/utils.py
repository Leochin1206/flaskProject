def criar_usuario_e_token(client, app, nivel="comum"):
    import uuid

    email_unico = f"user_{uuid.uuid4()}@test.com"
    res = client.post("/usuario/", json={
        "nome": "Usuário Teste",
        "email": email_unico,
        "telefone": "123456789",
        "senha": "senha123",
        "nivel": nivel
    })

    if res.status_code != 201:
        print("ERRO ao criar usuário:", res.status_code, res.get_json())
    assert res.status_code == 201
    user_id = res.get_json()['id']

    # Realiza login para obter o token JWT
    token_res = client.post("/auth/login", json={
        "email": email_unico,
        "senha": "senha123"
    })

    print("Login status code:", token_res.status_code)
    print("Login response json:", token_res.get_json())

    assert token_res.status_code == 200, "Falha no login, não foi possível obter o token"

    token_json = token_res.get_json()
    token = token_json.get("token")  # Aqui, alterado de "access_token" para "token"

    assert token is not None, "Token JWT não retornado no login"

    headers = {"Authorization": f"Bearer {token}"}

    return user_id, headers

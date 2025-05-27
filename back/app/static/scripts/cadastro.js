document.getElementById("cadastroForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, telefone, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || "Erro ao cadastrar.");
        }

        alert("Usuário cadastrado com sucesso!");
        window.location.href = "/home";
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar: " + error.message);
    }
});

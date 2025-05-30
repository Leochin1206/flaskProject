function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));

    try {
        const payload = JSON.parse(payloadJson);
        return payload.sub || null;
    } catch {
        return null;
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const userId = getUserIdFromToken();
  if (!userId) {
    console.error("Usuário não autenticado");
    return;
  }

  async function carregarDadosUsuario() {
    try {
      const response = await fetch(`/usuario/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário");
      }

      const dados = await response.json();

      document.getElementById("nameUser").value = dados.nome || "";
      document.getElementById("email").value = dados.email || "";
      document.getElementById("telefone").value = dados.telefone || "";
      document.getElementById("password").value = "";

    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  }

  carregarDadosUsuario();

  const form = document.getElementById("configUser");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dadosAtualizados = {
      nome: document.getElementById("nameUser").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value
    };

    const senha = document.getElementById("password").value.trim();
    if (senha !== "") {
      dadosAtualizados.senha = senha;
    }

    try {
      const response = await fetch(`/usuario/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dadosAtualizados)
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar usuário");
      }

      const result = await response.json();
      alert(result.msg || "Dados atualizados com sucesso!");
      document.getElementById("password").value = "";
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar os dados. Tente novamente.");
    }
  });
});

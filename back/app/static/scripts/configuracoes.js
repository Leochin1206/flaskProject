function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return null;
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);
      return payload.sub || null;
  } catch (e) {
      console.error("Erro ao decodificar o token:", e);
      return null;
  }
}

function handleLogout() {
  console.log("Executando logout...");
  localStorage.removeItem('token');
  window.location.href = '/';
}

document.addEventListener("DOMContentLoaded", () => {
  const userId = getUserIdFromToken();
  const logoutButton = document.getElementById('logoutButton');

  if (logoutButton) {
      logoutButton.addEventListener('click', function (event) {
          event.preventDefault();
          handleLogout();
      });
  }

  if (!userId) {
      console.error("Usuário não autenticado. Redirecionando para login.");
      return;
  }

  const nameUserInput = document.getElementById("nameUser");
  const emailInput = document.getElementById("email");
  const telefoneInput = document.getElementById("telefone");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const form = document.getElementById("configUser");

  async function carregarDadosUsuario() {
      try {
          const response = await fetch(`/usuario/${userId}`, {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
          });

          if (!response.ok) {
              if (response.status === 401) { 
                  console.error("Sessão inválida. Redirecionando para login.");
                  handleLogout(); 
              }
              throw new Error(`Erro ao buscar dados do usuário (${response.status})`);
          }

          const dados = await response.json();

          if (nameUserInput) nameUserInput.value = dados.nome || "";
          if (emailInput) emailInput.value = dados.email || "";
          if (telefoneInput) telefoneInput.value = dados.telefone || "";
          if (passwordInput) passwordInput.value = "";
          if (confirmPasswordInput) confirmPasswordInput.value = "";

      } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
      }
  }

  if (form) {
      carregarDadosUsuario();

      form.addEventListener("submit", async (e) => {
          e.preventDefault();

          const nome = nameUserInput.value.trim();
          const email = emailInput.value.trim();
          const telefone = telefoneInput.value.trim();
          const senhaAtualParaVerificacao = passwordInput.value; 
          const confirmaSenhaAtual = confirmPasswordInput.value;

          if (!nome || !email || !telefone) {
              alert("Por favor, preencha nome, email e telefone.");
              return;
          }

          if (!senhaAtualParaVerificacao) {
              alert("Por favor, digite sua senha atual para salvar as alterações.");
              passwordInput.focus();
              return;
          }

          if (senhaAtualParaVerificacao !== confirmaSenhaAtual) {
              alert("As senhas atual e de confirmação não coincidem.");
              confirmPasswordInput.value = "";
              passwordInput.value = "";
              passwordInput.focus();
              return;
          }

          const dadosParaAtualizar = {
              nome: nome,
              email: email,
              telefone: telefone,
              senha_atual_verificacao: senhaAtualParaVerificacao 
          };

          try {
              const response = await fetch(`/usuario/${userId}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify(dadosParaAtualizar)
              });

              const result = await response.json(); 

              if (!response.ok) {
                  if (response.status === 401 || response.status === 403) {
                       alert(result.msg || result.error || "A senha atual fornecida está incorreta.");
                  } else {
                      alert(result.msg || result.error || "Erro ao atualizar os dados.");
                  }
                  throw new Error(result.msg || result.error || `Erro HTTP ${response.status}`);
              }

              alert(result.msg || "Dados atualizados com sucesso!");
              passwordInput.value = ""; 
              confirmPasswordInput.value = "";

          } catch (error) {
              console.error("Erro na requisição de atualização:", error);
              if (!(response && !response.ok && result && (result.msg || result.error))) {
                   alert("Ocorreu um erro ao tentar atualizar seus dados. Verifique o console para mais detalhes.");
              }
          }
      });
  } else {
      console.error("Formulário de configuração #configUser não encontrado.");
  }
});
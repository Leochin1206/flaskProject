document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const nome = document.getElementById("nome").value;
    const senha = document.getElementById("senha").value;
  
    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, senha }),
      });
  
      if (!response.ok) {
        throw new Error("Falha no login");
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
  
      window.location.href = "/home.html";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Usuário ou senha incorretos. Tente novamente.");
    }
  });
  
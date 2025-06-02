document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value; // <-- alterado de nome para email
  const senha = document.getElementById("senha").value;

  try {
    const response = await fetch("http://127.0.0.1:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }), // <-- aqui também
    });

    if (!response.ok) {
      throw new Error("Falha no login");
    }

    const data = await response.json();
    console.log("teste", data.token)
    localStorage.setItem("token", data.token); // <-- "token" e não "access"
    window.location.href = "/home";
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    alert("Usuário ou senha incorretos. Tente novamente.");
  }
});

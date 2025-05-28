const modal = document.getElementById("modalTransacao");
const form = document.getElementById("formTransacao");

function abrirModal() {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function fecharModal() {
  modal.classList.remove("flex");
  modal.classList.add("hidden");
  form.reset();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  const dados = Object.fromEntries(formData.entries());

  console.log("Transação cadastrada:", dados);
  alert("Transação adicionada com sucesso!");
  fecharModal();
});
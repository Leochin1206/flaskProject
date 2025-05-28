document.getElementById('formTransacao').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const jsonData = {
    tipo: formData.get('tipo'),
    valor: parseFloat(formData.get('valor')), // forçando número
    categoria: formData.get('categoria'),
    data: formData.get('data'), // assume formato yyyy-mm-dd vindo do input type="date"
    descricao: formData.get('descricao'),
    id_usuario: 1 // fixo como solicitado
  };

  console.log("Enviando dados:", jsonData); // verifique se está igual ao formato desejado

  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://127.0.0.1:5000/transacao/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(jsonData)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.msg || "Transação criada!");
      this.reset();
      fecharModal();
    } else {
      alert("Erro: " + (result.msg || result.error || 'Erro desconhecido'));
    }

  } catch (err) {
    console.error(err);
    alert("Erro na requisição");
  }
});

function abrirModal() {
  document.getElementById('modalTransacao').classList.remove('hidden');
}

function fecharModal() {
  document.getElementById('modalTransacao').classList.add('hidden');
}

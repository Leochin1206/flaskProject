document.getElementById('formTransacao').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const jsonData = {
    tipo: formData.get('tipo'),
    valor: parseFloat(formData.get('valor')),
    categoria: formData.get('categoria'),
    data: formData.get('data'),
    descricao: formData.get('descricao'),
    id_usuario: 1
  };

  console.log("Enviando dados:", jsonData);

  try {
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Token de autenticação não encontrado. Faça login.");
      return;
    }


    const apiUrl = 'http://127.0.0.1:5000/transacao/post';
    const response = await fetch(apiUrl, {
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

const transacoesTipo = [
  { nome: "Alimentação", icone: "utensils", value: "alimentacao" },
  { nome: "Transporte", icone: "car", value: "transporte" },
  { nome: "Moradia", icone: "home", value: "moradia" },
  { nome: "Lazer", icone: "gamepad-2", value: "lazer" },
  { nome: "Saúde", icone: "heart-pulse", value: "saude" },
  { nome: "Educação", icone: "book-open", value: "educacao" },
  { nome: "Compras", icone: "shopping-cart", value: "compras" },
  { nome: "Assinaturas", icone: "badge-dollar-sign", value: "assinaturas" },
  { nome: "Salário", icone: "wallet", value: "salario" },
  { nome: "Investimentos", icone: "trending-up", value: "investimentos" },
  { nome: "Dívidas", icone: "banknote", value: "dividas" },
  { nome: "Presentes", icone: "gift", value: "presentes" },
  { nome: "Impostos", icone: "file-text", value: "impostos" },
  { nome: "Viagens", icone: "plane", value: "viagens" },
  { nome: "Pets", icone: "paw-print", value: "pets" },
  { nome: "Outro", icone: "more-horizontal", value: "outro" }
];

document.addEventListener('DOMContentLoaded', carregarTransacoes);

async function carregarTransacoes() {
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Token não encontrado. Faça login.");
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:5000/transacao/get', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data = await response.json();
    console.log(data)

    if (response.ok) {
      const ul = document.getElementById('listaTransacoes');
      ul.innerHTML = '';

      data.forEach(t => {
        const tipoObj = transacoesTipo.find(tipo => tipo.value === t.categoria);
        const icone = tipoObj ? tipoObj.icone : "more-horizontal";

        const li = document.createElement('li');
        li.className = "flex items-start justify-between relative gap-4 bg-gray-100 mb-4 p-4 rounded-lg shadow w-[800px]";

        li.innerHTML = `
          <div class="absolute top-4 right-4 text-blue-600 w-10 h-10" data-lucide="${icone}"></div>

          <div class="w-full space-y-2">
            <div><span class="font-semibold">Tipo:</span> ${t.tipo}</div>
            <div class="text-green-600 font-bold"><span class="font-semibold">Valor:</span> R$${t.valor.toFixed(2)}</div>
            <div><span class="font-semibold">Categoria:</span> ${t.categoria}</div>
            <div><span class="font-semibold">Data:</span> ${t.data}</div>
            <div><span class="font-semibold">Descrição:</span> ${t.descricao}</div>

            <div class="flex justify-end gap-4 pt-2">
              <button class="text-sm text-blue-600 hover:underline">Editar</button>
              <button class="text-sm text-red-600 hover:underline" onclick="deletarTransacao(${t.id})">Excluir</button>
            </div>
          </div>
        `;

        ul.appendChild(li);
      });

      lucide.createIcons();
    } else {
      alert("Erro ao carregar transações: " + (data.msg || data.error));
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao buscar transações.");
  }
}


async function deletarTransacao(id) {
  const confirmar = confirm("Tem certeza que deseja excluir esta transação?");
  if (!confirmar) return;

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`http://127.0.0.1:5000/transacao/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.msg || "Transação deletada com sucesso!");
      carregarTransacoes();
    } else {
      alert("Erro ao deletar transação: " + (result.msg || result.error));
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao tentar deletar transação.");
  }
}


function abrirModal() {
  document.getElementById('modalTransacao').classList.remove('hidden');
}

function fecharModal() {
  document.getElementById('modalTransacao').classList.add('hidden');
}

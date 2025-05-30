document.getElementById('formMeta').addEventListener('submit', async function (e) {
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


    const apiUrl = 'http://127.0.0.1:5000/meta';
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
      alert(result.msg || "Meta criada!");
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

const metaTipo = [
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

document.addEventListener('DOMContentLoaded', carregarMeta);

async function carregarMeta() {
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Token não encontrado. Faça login.");
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:5000/meta', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data = await response.json();
    console.log(data)

    if (response.ok) {
      const ul = document.getElementById('listaMeta');
      ul.innerHTML = '';

      data.forEach(t => {
        const tipoObj = metaTipo.find(tipo => tipo.value === t.categoria);
        const icone = tipoObj ? tipoObj.icone : "more-horizontal";

        const li = document.createElement('li');
        li.className = "flex items-start justify-between relative gap-4 bg-gray-100 mb-4 p-4 rounded-lg shadow w-[800px]";

        li.innerHTML = `
          <div class="absolute top-4 right-4 text-blue-600 w-10 h-10" data-lucide="${icone}"></div>

          <div class="w-full space-y-2">
            <div><span class="font-semibold">Tipo:</span> ${t.tipo}</div>
            <div class="text-green-600 font-bold"><span class="font-semibold">Valor:</span> R$${(typeof t.valor === "number" && !isNaN(t.valor)) ? t.valor.toFixed(2) : "0.00"}</div>
            <div><span class="font-semibold">Categoria:</span> ${t.categoria}</div>
            <div><span class="font-semibold">Data:</span> ${new Date(t.data).toLocaleDateString("pt-BR")}</div>
            <div><span class="font-semibold">Descrição:</span> ${t.descricao}</div>

            <div class="flex justify-end gap-4 pt-2">
              <button class="text-sm text-blue-600 hover:underline" onclick="abrirModalEdicao(${t.id})">Editar</button>
              <button class="text-sm text-red-600 hover:underline" onclick="deletarMeta(${t.id})">Excluir</button>
            </div>
          </div>
        `;

        ul.appendChild(li);
      });

      lucide.createIcons();
    } else {
      alert("Erro ao carregar Meta: " + (data.msg || data.error));
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao buscar Meta.");
  }
}

function abrirModalEdicao(id) {
  const token = localStorage.getItem("token");

  fetch(`http://127.0.0.1:5000/meta/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(dados => {
      document.querySelector('#modalMetaEdit input[name="tipo"][value="' + dados.tipo + '"]').checked = true;
      document.querySelector('#modalMetaEdit #valor').value = dados.valor;
      document.querySelector('#modalMetaEdit #categoria').value = dados.categoria;

      const dataObj = new Date(dados.data);
      const dataFormatada = dataObj.toISOString().split("T")[0];
      document.querySelector('#modalMetaEdit #data').value = dataFormatada;

      document.querySelector('#modalMetaEdit #descricao').value = dados.descricao;

      document.getElementById('formMetaEdit').setAttribute('data-id', id);
      document.getElementById('modalMetaEdit').classList.remove('hidden');
    })
    .catch(error => console.error('Erro ao buscar Meta para edição:', error));
}


document.getElementById("formMetaEdit").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = e.target.getAttribute("data-id");
  const token = localStorage.getItem("token");

  const tipo = document.querySelector('#modalMetaEdit input[name="tipo"]:checked')?.value || "";
  const valorRaw = document.querySelector('#modalMetaEdit #valor').value.trim();
  const valor = parseFloat(valorRaw.replace(",", "."));
  const categoria = document.querySelector('#modalMetaEdit #categoria').value.trim();
  const data = document.querySelector('#modalMetaEdit #data').value;
  const descricao = document.querySelector('#modalMetaEdit #descricao').value.trim();

  if (!tipo || isNaN(valor) || !data) {
    console.error("Preencha todos os campos obrigatórios corretamente.");
    alert("Preencha todos os campos obrigatórios (tipo, valor numérico e data).");
    return;
  }

  const metaAtualizada = {
    tipo,
    valor,
    categoria,
    data,
    descricao,
  };

  fetch(`http://127.0.0.1:5000/meta/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(metaAtualizada)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      console.log("Meta atualizada:", data);

      document.getElementById("modalMetaEdit").classList.add("hidden");
      carregarMeta();
    })
    .catch(error => {
      console.error("Erro ao atualizar Meta:", error);
    });
});

async function deletarMeta(id) {
  const confirmar = confirm("Tem certeza que deseja excluir esta Meta?");
  if (!confirmar) return;

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`http://127.0.0.1:5000/meta/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.msg || "Meta deletada com sucesso!");
      carregarTransacoes();
    } else {
      alert("Erro ao deletar Meta: " + (result.msg || result.error));
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao tentar deletar Meta.");
  }
}

function abrirModal() {
  document.getElementById('modalMeta').classList.remove('hidden');
}

function fecharModal() {
  document.getElementById('modalMeta').classList.add('hidden');
}

function fecharModalEdit() {
  document.getElementById('modalMetaEdit').classList.add('hidden');
}

document.getElementById('formMeta').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const jsonData = {
    nome: formData.get('nome'),
    descricao: formData.get('descricao'),
    categoria: formData.get('categoria'),
    valor_atual: parseFloat(formData.get('valor_atual')),
    valor_objetivo: parseFloat(formData.get('valor_objetivo')),
    data_limite: formData.get('data_limite') || "2025-12-31",
    data_criacao: new Date().toISOString().split('T')[0],
    id_usuario: 1,
  };

  console.log("Enviando dados:", jsonData);

  try {
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Token de autenticação não encontrado. Faça login.");
      return;
    }


    const apiUrl = 'http://127.0.0.1:5000/meta/';
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
    console.log(data);

    if (response.ok) {
      const ul = document.getElementById('listaMeta');
      ul.innerHTML = '';

      data.forEach(t => {
        const tipoObj = metaTipo.find(tipo => tipo.value === t.categoria);
        const icone = tipoObj ? tipoObj.icone : "more-horizontal";
        const valorAtual = (typeof t.valor_atual === "number" && !isNaN(t.valor_atual)) ? t.valor_atual : 0;
        const valorObjetivo = (typeof t.valor_objetivo === "number" && !isNaN(t.valor_objetivo)) ? t.valor_objetivo : 0;
        const valorAtualFormatado = valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        const valorObjetivoFormatado = valorObjetivo.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

        let percentualProgresso = 0;
        if (valorObjetivo > 0) {
          percentualProgresso = (valorAtual / valorObjetivo) * 100;
        }

        percentualProgresso = Math.min(Math.max(percentualProgresso, 0), 100);

        const li = document.createElement('li');
        li.className = "flex items-start justify-between relative gap-4 bg-gray-100 mb-4 p-4 rounded-lg shadow w-[800px]";

        li.innerHTML = `
          <div class="absolute top-4 right-4 text-blue-600 w-10 h-10" data-lucide="${icone}"></div>

          <div class="w-full space-y-2">
            <div><span class="font-semibold">Nome da meta:</span> ${t.nome}</div>
            <div><span class="font-semibold">Descrição:</span> ${t.descricao || ''}</div>
            <div><span class="font-semibold">Categoria:</span> ${t.categoria}</div>
            <div><span class="font-semibold">Data Limite:</span> ${new Date(t.data_limite).toLocaleDateString("pt-BR")}</div>

            <div class="progress-section mt-3">
              <div class="text-sm text-gray-700 mb-1">
                R$ ${valorAtualFormatado} de R$ ${valorObjetivoFormatado}
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${percentualProgresso}%"></div>
              </div>
            </div>
            <div class="flex justify-end gap-4 pt-2">
              <button class="text-sm text-blue-600 hover:underline" onclick="abrirModalEdicao(${t.id})">Editar</button>
              <button class="text-sm text-red-600 hover:underline" onclick="deletarMeta(${t.id})">Excluir</button>
            </div>
          </div>
        `;

        ul.appendChild(li);
      });

      if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }

    } else {
      alert("Erro ao carregar Metas: " + (data.message || data.error || "Erro desconhecido"));
    }
  } catch (err) {
    console.error("Erro na função carregarMeta:", err);
    alert("Erro ao buscar Metas. Verifique o console para mais detalhes.");
  }
}

function abrirModalEdicao(id) {
  const token = localStorage.getItem("token");

  fetch(`http://127.0.0.1:5000/meta/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erro ao buscar meta: ${res.status}`);
      }
      return res.json();
    })
    .then(dados => {
      document.querySelector('#modalMetaEdit #nome').value = dados.nome || "";
      document.querySelector('#modalMetaEdit #valor_atual').value = dados.valor_atual !== undefined ? dados.valor_atual : (dados.valor || "");
      document.querySelector('#modalMetaEdit #valor_objetivo').value = dados.valor_objetivo !== undefined ? dados.valor_objetivo : (dados.valor || "");
      document.querySelector('#modalMetaEdit #categoria').value = dados.categoria || "";

      const dataParaFormatar = dados.data_limite || dados.data;
      if (dataParaFormatar) {
        const dataObj = new Date(dataParaFormatar);
        if (!isNaN(dataObj.getTime())) {
          const dataFormatada = dataObj.toISOString().split("T")[0];
          document.querySelector('#modalMetaEdit #data_limite').value = dataFormatada;
        } else {
          document.querySelector('#modalMetaEdit #data_limite').value = "";
          console.warn("Data recebida do backend é inválida:", dataParaFormatar);
        }
      } else {
        document.querySelector('#modalMetaEdit #data_limite').value = "";
      }

      document.querySelector('#modalMetaEdit #descricao').value = dados.descricao || "";
      document.getElementById('formMetaEdit').setAttribute('data-id', id);
      document.getElementById('modalMetaEdit').classList.remove('hidden');
    })
    .catch(error => console.error('Erro ao buscar Meta para edição:', error));
}

document.getElementById("formMetaEdit").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = e.target.getAttribute("data-id");
  const token = localStorage.getItem("token");
  const nome = document.querySelector('#modalMetaEdit #nome').value.trim();

  const valorAtualRaw = document.querySelector('#modalMetaEdit #valor_atual').value.trim();
  const valorAtual = parseFloat(valorAtualRaw.replace(",", "."));

  const valorObjetivoRaw = document.querySelector('#modalMetaEdit #valor_objetivo').value.trim();
  const valorObjetivo = parseFloat(valorObjetivoRaw.replace(",", "."));

  const categoria = document.querySelector('#modalMetaEdit #categoria').value.trim();
  const dataLimite = document.querySelector('#modalMetaEdit #data_limite').value;
  const descricao = document.querySelector('#modalMetaEdit #descricao').value.trim();

  if (!nome || isNaN(valorObjetivo) || isNaN(valorAtual) || !dataLimite || !categoria) {
    console.error("Preencha todos os campos obrigatórios corretamente. (Validação JS falhou)");
    alert("Preencha todos os campos obrigatórios (Nome, Valor Objetivo numérico, Categoria e Data Limite).");
    return;
  }

  const metaAtualizada = {
    nome: nome,
    valor_atual: valorAtual,
    valor_objetivo: valorObjetivo,
    categoria: categoria,
    data_limite: dataLimite,
    descricao: descricao,
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
        return res.json().then(errData => {
          throw new Error(`Erro ${res.status}: ${res.statusText} - ${errData.message || JSON.stringify(errData)}`);
        }).catch(() => {
          throw new Error(`Erro ${res.status}: ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(data => {
      console.log("Meta atualizada:", data);
      document.getElementById("modalMetaEdit").classList.add("hidden");
      if (typeof carregarMeta === "function") {
        carregarMeta();
      } else {
        console.warn("Função carregarMeta() não definida. A lista de metas pode não ser atualizada automaticamente.");
      }
    })
    .catch(error => {
      console.error("Erro ao atualizar Meta:", error);
      alert(`Erro ao atualizar Meta: ${error.message}`);
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
      carregarMeta();
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

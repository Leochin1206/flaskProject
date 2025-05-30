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

async function carregarTransacoes(startDate, endDate) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Token não encontrado. Faça login.");
    return;
  }

  let url = 'http://127.0.0.1:5000/transacao/get';
  const params = new URLSearchParams();

  if (startDate) {
    params.append('startDate', startDate.toISOString());
  }
  if (endDate) {
    params.append('endDate', endDate.toISOString());
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const data = await response.json();
    console.log('Dados recebidos para o filtro:', data); 

    if (response.ok) {
      const ul = document.getElementById('listaTransacoes');
      ul.innerHTML = ''; 

      data.forEach(t => {
        const tipoObj = transacoesTipo.find(tipo => tipo.value === t.categoria);
        const icone = tipoObj ? tipoObj.icone : "more-horizontal";

        const valorTransacao = (typeof t.valor === "number" && !isNaN(t.valor)) ? t.valor : 0;
        let valorDivColorClass = 'text-gray-700';
        let iconColorClass = 'text-gray-500';

        if (valorTransacao > 0) {
          valorDivColorClass = 'text-green-600';
          iconColorClass = 'text-green-600';
        } else if (valorTransacao < 0) {
          valorDivColorClass = 'text-red-600';
          iconColorClass = 'text-red-600';
        }
        const valorDisplay = valorTransacao.toFixed(2).replace('.', ',');

        const li = document.createElement('li');
        li.className = "flex items-start justify-between relative gap-4 bg-gray-100 mb-4 p-4 rounded-lg shadow w-[800px]";
        li.innerHTML = `
          <div class="absolute top-4 right-4 ${iconColorClass} w-10 h-10" data-lucide="${icone}"></div>
          <div class="w-full space-y-2">
            <div><span class="font-semibold">Tipo:</span> ${t.tipo}</div>
            <div class="${valorDivColorClass} font-bold">
              <span class="font-semibold">Valor:</span> R$${valorDisplay}
            </div>
            <div><span class="font-semibold">Categoria:</span> ${t.categoria}</div>
            <div><span class="font-semibold">Data:</span> ${new Date(t.data).toLocaleDateString("pt-BR")}</div>
            <div><span class="font-semibold">Descrição:</span> ${t.descricao || ''}</div>
            <div class="flex justify-end gap-4 pt-2">
              <button class="text-sm text-blue-600 hover:underline" onclick="abrirModalEdicao(${t.id})">Editar</button>
              <button class="text-sm text-red-600 hover:underline" onclick="deletarTransacao(${t.id})">Excluir</button>
            </div>
          </div>
        `;
        ul.appendChild(li);
      });

      if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      } else {
        console.warn('Lucide icons não foram carregados ou a função createIcons não está disponível.');
      }

    } else {
      alert("Erro ao carregar transações: " + (data.message || data.error || "Erro desconhecido"));
    }
  } catch (err) {
    console.error("Erro na função carregarTransacoes com filtro:", err);
    alert("Erro ao buscar transações filtradas. Verifique o console para mais detalhes.");
  }
}

function getStartOfDay(date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

function getEndOfDay(date) {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

const filterButtons = []; 

function setActiveButton(activeBtnId) {
  filterButtons.forEach(btn => {
    if (btn.id === activeBtnId) {
      btn.classList.add('bg-blue-500', 'text-white'); 
      btn.classList.remove('text-gray-600');
    } else {
      btn.classList.remove('bg-blue-500', 'text-white');
      btn.classList.add('text-gray-600'); 
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const btnHoje = document.getElementById('filterHoje');
  const btnSemana = document.getElementById('filterSemana');
  const btnMes = document.getElementById('filterMes');

  if (btnHoje && btnSemana && btnMes) {
    filterButtons.push(btnHoje, btnSemana, btnMes); 

    btnHoje.addEventListener('click', () => {
      const today = new Date();
      const startDate = getStartOfDay(today);
      const endDate = getEndOfDay(today);
      console.log('Filtrando por Hoje:', startDate.toISOString(), endDate.toISOString());
      carregarTransacoes(startDate, endDate);
      setActiveButton('filterHoje');
    });

    btnSemana.addEventListener('click', () => {
      const today = new Date();
      const dayOfWeek = today.getDay(); 
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() + diffToMonday);
      const startDate = getStartOfDay(startOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); 
      const endDate = getEndOfDay(endOfWeek);
      
      console.log('Filtrando por Semana:', startDate.toISOString(), endDate.toISOString());
      carregarTransacoes(startDate, endDate);
      setActiveButton('filterSemana');
    });

    btnMes.addEventListener('click', () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const startDate = getStartOfDay(new Date(year, month, 1)); 
      const endDate = getEndOfDay(new Date(year, month + 1, 0)); 
      
      console.log('Filtrando por Mês:', startDate.toISOString(), endDate.toISOString());
      carregarTransacoes(startDate, endDate);
      setActiveButton('filterMes');
    });

    if(btnHoje) { 
        btnHoje.click();
    }

  } else {
    console.error("Um ou mais botões de filtro não foram encontrados. Verifique os IDs no HTML.");
  }
});

function abrirModalEdicao(id) {
  const token = localStorage.getItem("token");

  fetch(`http://127.0.0.1:5000/transacao/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(dados => {
      document.querySelector('#modalTransacaoEdit input[name="tipo"][value="' + dados.tipo + '"]').checked = true;
      document.querySelector('#modalTransacaoEdit #valor').value = dados.valor;
      document.querySelector('#modalTransacaoEdit #categoria').value = dados.categoria;

      const dataObj = new Date(dados.data);
      const dataFormatada = dataObj.toISOString().split("T")[0];
      document.querySelector('#modalTransacaoEdit #data').value = dataFormatada;

      document.querySelector('#modalTransacaoEdit #descricao').value = dados.descricao;

      document.getElementById('formTransacaoEdit').setAttribute('data-id', id);
      document.getElementById('modalTransacaoEdit').classList.remove('hidden');
    })
    .catch(error => console.error('Erro ao buscar transação para edição:', error));
}

document.getElementById("formTransacaoEdit").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = e.target.getAttribute("data-id");
  const token = localStorage.getItem("token");

  const tipo = document.querySelector('#modalTransacaoEdit input[name="tipo"]:checked')?.value || "";
  const valorRaw = document.querySelector('#modalTransacaoEdit #valor').value.trim();
  const valor = parseFloat(valorRaw.replace(",", "."));
  const categoria = document.querySelector('#modalTransacaoEdit #categoria').value.trim();
  const data = document.querySelector('#modalTransacaoEdit #data').value;
  const descricao = document.querySelector('#modalTransacaoEdit #descricao').value.trim();


  // Validação mínima dos campos
  if (!tipo || isNaN(valor) || !data) {
    console.error("Preencha todos os campos obrigatórios corretamente.");
    alert("Preencha todos os campos obrigatórios (tipo, valor numérico e data).");
    return;
  }

  const transacaoAtualizada = {
    tipo,
    valor,
    categoria,
    data,
    descricao,
  };

  fetch(`http://127.0.0.1:5000/transacao/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(transacaoAtualizada)
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      console.log("Transação atualizada:", data);

      document.getElementById("modalTransacaoEdit").classList.add("hidden");
      carregarTransacoes();
    })
    .catch(error => {
      console.error("Erro ao atualizar transação:", error);
    });
});

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

function fecharModalEdit() {
  document.getElementById('modalTransacaoEdit').classList.add('hidden');
}

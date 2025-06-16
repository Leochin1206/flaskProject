function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) {
      console.error("Token não encontrado no localStorage.");
      return null;
  }
  try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
          console.error("Formato de token inválido (sem payload).");
          return null;
      }
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);
      return payload.sub || payload.user_id || payload.id || null;
  } catch (e) {
      console.error("Erro ao decodificar o token:", e);
      return null;
  }
}

function formatDateAsLocal(dateString) {
  if (!dateString || typeof dateString !== 'string') {
      return "Data inválida";
  }
  const dateOnlyString = dateString.substring(0, 10);
  const parts = dateOnlyString.split('-');

  if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; 
      const day = parseInt(parts[2], 10);

      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          const localDate = new Date(year, month, day); 
          if (localDate.getFullYear() === year && localDate.getMonth() === month && localDate.getDate() === day) {
              const dayFormatted = String(localDate.getDate()).padStart(2, '0');
              const monthFormatted = String(localDate.getMonth() + 1).padStart(2, '0'); 
              return `${dayFormatted}/${monthFormatted}/${localDate.getFullYear()}`;
          }
      }
  }
  console.warn(`Formato de data inesperado ou data inválida em formatDateAsLocal: ${dateString}. Tentando fallback.`);
  try {
      const fallbackDate = new Date(dateString); 
      if (!isNaN(fallbackDate.getTime())) {
           return fallbackDate.toLocaleDateString('pt-BR'); 
      }
  } catch (e) {}
  return "Data inválida";
}


document.getElementById('formMeta').addEventListener('submit', async function (e) {
  e.preventDefault();

  const userId = getUserIdFromToken();

  if (!userId) {
      alert("Erro: Usuário não autenticado ou token inválido. Faça login novamente.");
      return;
  }

  const formData = new FormData(this);
  const jsonData = {
      nome: formData.get('nome'),
      descricao: formData.get('descricao'),
      categoria: formData.get('categoria'),
      valor_atual: parseFloat(formData.get('valor_atual')) || 0, 
      valor_objetivo: parseFloat(formData.get('valor_objetivo')) || 0, 
      data_limite: formData.get('data_limite') || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], 
      data_criacao: new Date().toISOString().split('T')[0],
      id_usuario: userId, 
  };

  if (isNaN(jsonData.valor_atual) || isNaN(jsonData.valor_objetivo)) {
      alert("Por favor, insira valores numéricos válidos para 'Valor Atual' e 'Valor Objetivo'.");
      return;
  }
  if (jsonData.valor_objetivo <= 0) {
      alert("O 'Valor Objetivo' deve ser maior que zero.");
      return;
  }
   if (jsonData.valor_atual < 0) {
      alert("O 'Valor Atual' não pode ser negativo.");
      return;
  }

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
          alert(result.msg || "Meta criada com sucesso!");
          this.reset();
          if (typeof fecharModal === "function") { 
              fecharModal();
          } else {
              console.warn("Função fecharModal() não definida.");
          }
          window.location.reload();

      } else {
          alert("Erro ao criar meta: " + (result.msg || result.error || `Erro HTTP ${response.status}`));
      }

  } catch (err) {
      console.error("Erro na requisição ao criar meta:", err);
      alert("Erro na requisição. Verifique o console para mais detalhes.");
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
  const userId = getUserIdFromToken(); 

  if (!token) {
      alert("Token de autenticação não encontrado. Por favor, faça login.");
      return;
  }

  if (!userId) { 
      alert("Não foi possível identificar o usuário a partir do token. Por favor, faça login novamente.");
      return;
  }

  const apiUrl = `http://127.0.0.1:5000/meta?id_usuario=${userId}`;

  try {
      const response = await fetch(apiUrl, { 
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + token
          }
      });

      const data = await response.json();
      console.log("Dados das metas recebidos:", data);

      if (response.ok) {
          const ul = document.getElementById('listaMeta');
          if (!ul) {
              console.error("Elemento com ID 'listaMeta' não encontrado no DOM.");
              return;
          }
          ul.innerHTML = ''; 

          if (data && data.length > 0) { 
              data.forEach(t => {
                  const tipoObj = typeof metaTipo !== 'undefined' ? metaTipo.find(tipo => tipo.value === t.categoria) : null;
                  const icone = tipoObj ? tipoObj.icone : "more-horizontal";
                  const valorAtual = (typeof t.valor_atual === "number" && !isNaN(t.valor_atual)) ? t.valor_atual : 0;
                  const valorObjetivo = (typeof t.valor_objetivo === "number" && !isNaN(t.valor_objetivo)) ? t.valor_objetivo : 0;
                  const valorAtualFormatado = valorAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                  const valorObjetivoFormatado = valorObjetivo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                  let percentualProgresso = 0;
                  if (valorObjetivo > 0) { 
                      percentualProgresso = (valorAtual / valorObjetivo) * 100;
                  }
                  percentualProgresso = Math.min(Math.max(percentualProgresso, 0), 100); 
                  const dataLimiteFormatada = formatDateAsLocal(t.data_limite); 
                  const li = document.createElement('li');
                  li.className = "flex items-start justify-between relative gap-4 bg-gray-100 mb-4 p-4 rounded-lg shadow md:w-[800px] w-full";
                  li.innerHTML = `
                      <div class="absolute top-4 right-4 text-blue-600 w-10 h-10" data-lucide="${icone}"></div>
                      <div class="w-full space-y-2">
                          <div><span class="font-semibold">Nome da meta:</span> ${t.nome}</div>
                          <div><span class="font-semibold">Descrição:</span> ${t.descricao || 'Sem descrição'}</div>
                          <div><span class="font-semibold">Categoria:</span> ${t.categoria}</div>
                          <div><span class="font-semibold">Data Limite:</span> ${dataLimiteFormatada}</div>

                          <div class="progress-section mt-3">
                              <div class="text-sm text-gray-700 mb-1 flex justify-between">
                                  <span>${valorAtualFormatado}</span>
                                  <span>de ${valorObjetivoFormatado}</span>
                              </div>
                              <div class="w-full bg-gray-300 rounded-full h-3 dark:bg-gray-700">
                                  <div class="bg-blue-500 h-3 rounded-full" style="width: ${percentualProgresso}%"></div>
                              </div>
                              <div class="text-right text-sm text-blue-600 font-medium mt-1">${percentualProgresso.toFixed(0)}%</div>
                          </div>
                          <div class="flex justify-end gap-4 pt-2 mt-2 border-t border-gray-200">
                              <button class="text-sm text-blue-600 hover:text-blue-800 transition-colors" onclick="abrirModalEdicao(${t.id})">
                                  <i data-lucide="edit-3" class="inline-block w-4 h-4 mr-1"></i>Editar
                              </button>
                              <button class="text-sm text-red-600 hover:text-red-800 transition-colors" onclick="deletarMeta(${t.id})">
                                  <i data-lucide="trash-2" class="inline-block w-4 h-4 mr-1"></i>Excluir
                              </button>
                          </div>
                      </div>
                  `;
                  ul.appendChild(li);
              });
          } else {
              ul.innerHTML = '<li class="text-center text-gray-500 py-4">Nenhuma meta encontrada para este usuário.</li>';
          }

          if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
              lucide.createIcons(); 
          }

      } else {
          const ul = document.getElementById('listaMeta');
          if(ul) ul.innerHTML = `<li class="text-center text-red-500 py-4">Erro ao carregar metas: ${data.msg || data.error || `Status ${response.status}`}</li>`;
          alert("Erro ao carregar Metas: " + (data.msg || data.error || `Status ${response.status}`));
      }
  } catch (err) {
      console.error("Erro na requisição ou processamento em carregarMeta:", err);
      const ul = document.getElementById('listaMeta');
      if(ul) ul.innerHTML = '<li class="text-center text-red-500 py-4">Ocorreu um erro ao buscar suas metas. Tente novamente mais tarde.</li>';
      alert("Erro crítico ao buscar Metas. Verifique o console para mais detalhes.");
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

function handleLogout() {
  console.log("Executando logout...");
  localStorage.removeItem('token'); 
  window.location.href = '/'; 
}

document.addEventListener('DOMContentLoaded', function() {
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
      logoutButton.addEventListener('click', function(event) {
          event.preventDefault(); 
          handleLogout();
      });
  }

  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }
});
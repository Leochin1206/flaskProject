document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'http://127.0.0.1:5000/transacao/get';
    const totalBalanceEl = document.getElementById('total-balance');
    const totalIncomeMonthEl = document.getElementById('total-income-month');
    const totalExpenseMonthEl = document.getElementById('total-expense-month');
    const recentTransactionsBodyEl = document.getElementById('recent-transactions-body');
    const categorySummaryEl = document.getElementById('category-summary');
    const transactionsChartContainerEl = document.getElementById('transactions-chart-container');
    const loadingIndicatorEl = document.getElementById('loading-indicator');
    const dashboardContentEl = document.getElementById('dashboard-content');
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    const mockTransactions = [
        { "tipo": "entrada", "valor": "1500.00", "categoria": "Salário", "data": "2024-05-01T10:00:00Z", "descricao": "Salário mensal", "id_usuario": "user1", "data_criacao": "2024-05-01T10:00:00Z" },
        { "tipo": "saida", "valor": "80.50", "categoria": "Alimentação", "data": "2024-05-03T12:30:00Z", "descricao": "Almoço", "id_usuario": "user1", "data_criacao": "2024-05-03T12:30:00Z" },
    ];

    async function fetchData() {
        const token = localStorage.getItem('token'); 

        if (!token) {
            console.error("Token de autenticação não encontrado. Redirecionando para login.");
            window.location.href = '/'; 
            return; 
        }

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });


            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Token inválido ou expirado. Redirecionando para login.");
                    localStorage.removeItem('authToken'); 
                    window.location.href = '/';
                    return;
                }
                console.warn(`Erro na API: ${response.status}. Usando dados de exemplo.`);
                return mockTransactions;
            }
            
            const data = await response.json();
            return data;

        } catch (error) {
            console.error("Falha ao buscar dados da API:", error);
            console.warn("Usando dados de exemplo devido ao erro na API.");
            return mockTransactions;
        }
    }

    function formatCurrency(value) {
        return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function updateDashboard(transactions) {
        if (!transactions || transactions.length === 0) {
            loadingIndicatorEl.classList.add('hidden');
            dashboardContentEl.classList.remove('hidden');
            totalBalanceEl.textContent = formatCurrency(0);
            totalIncomeMonthEl.textContent = formatCurrency(0);
            totalExpenseMonthEl.textContent = formatCurrency(0);
            recentTransactionsBodyEl.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Nenhuma transação encontrada.</td></tr>';
            categorySummaryEl.innerHTML = '<p class="text-gray-500">Nenhuma categoria para exibir.</p>';
            transactionsChartContainerEl.innerHTML = '<p class="m-auto text-gray-500">Sem dados para o gráfico.</p>';
            return;
        }

        let balance = 0;
        transactions.forEach(t => {
            if (t.tipo === 'entrada') {
                balance += parseFloat(t.valor);
            } else if (t.tipo === 'saida') {
                balance -= parseFloat(t.valor);
            }
        });
        totalBalanceEl.textContent = formatCurrency(balance);
        totalBalanceEl.className = `text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        let monthlyIncome = 0;
        let monthlyExpense = 0;

        transactions.forEach(t => {
            const transactionDate = new Date(t.data);
            if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
                if (t.tipo === 'entrada') {
                    monthlyIncome += parseFloat(t.valor);
                } else if (t.tipo === 'saida') {
                    monthlyExpense += parseFloat(t.valor);
                }
            }
        });
        totalIncomeMonthEl.textContent = formatCurrency(monthlyIncome);
        totalExpenseMonthEl.textContent = formatCurrency(monthlyExpense);
        const sortedTransactions = transactions.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
        const recentTransactions = sortedTransactions.slice(0, 10);

        recentTransactionsBodyEl.innerHTML = '';
        if (recentTransactions.length > 0) {
            recentTransactions.forEach(t => {
                const row = recentTransactionsBodyEl.insertRow();
                row.className = t.tipo === 'entrada' ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100';
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${formatDate(t.data)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${t.tipo === 'entrada' ? 'text-green-700' : 'text-red-700'}">${formatCurrency(t.valor)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${t.categoria}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">${t.descricao || '-'}</td>
                `;
            });
        } else {
            recentTransactionsBodyEl.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Nenhuma transação recente.</td></tr>';
        }

        const categoryMap = {};
        transactions.forEach(t => {
            const value = parseFloat(t.valor);
            if (!categoryMap[t.categoria]) {
                categoryMap[t.categoria] = { entrada: 0, saida: 0 };
            }
            if (t.tipo === 'entrada') {
                categoryMap[t.categoria].entrada += value;
            } else {
                categoryMap[t.categoria].saida += value;
            }
        });

        categorySummaryEl.innerHTML = '';
        if (Object.keys(categoryMap).length > 0) {
            for (const category in categoryMap) {
                const summary = categoryMap[category];
                const netAmount = summary.entrada - summary.saida;
                const itemEl = document.createElement('div');
                itemEl.className = 'flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0';
                itemEl.innerHTML = `
                    <div>
                        <p class="text-md font-medium text-gray-800">${category}</p>
                        <div class="text-xs">
                            ${summary.entrada > 0 ? `<span class="text-green-600">Entradas: ${formatCurrency(summary.entrada)}</span>` : ''}
                            ${summary.saida > 0 ? `<span class="text-red-600 ml-2">Saídas: ${formatCurrency(summary.saida)}</span>` : ''}
                        </div>
                    </div>
                    <span class="text-lg font-semibold ${netAmount >= 0 ? 'text-green-700' : 'text-red-700'}">
                        ${formatCurrency(netAmount)}
                    </span>
                `;
                categorySummaryEl.appendChild(itemEl);
            }
        } else {
            categorySummaryEl.innerHTML = '<p class="text-gray-500">Nenhuma categoria para exibir.</p>';
        }

        const monthlyData = {};
        transactions.forEach(t => {
            const date = new Date(t.data);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = { entrada: 0, saida: 0, monthLabel: `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}` };
            }
            if (t.tipo === 'entrada') {
                monthlyData[monthYear].entrada += parseFloat(t.valor);
            } else {
                monthlyData[monthYear].saida += parseFloat(t.valor);
            }
        });

        const sortedMonths = Object.keys(monthlyData).sort();
        const chartData = sortedMonths.map(month => monthlyData[month]);

        transactionsChartContainerEl.innerHTML = '';
        if (chartData.length > 0) {
            const maxEntrada = Math.max(...chartData.map(d => d.entrada), 0);
            const maxSaida = Math.max(...chartData.map(d => d.saida), 0);
            const overallMax = Math.max(maxEntrada, maxSaida);

            if (overallMax > 0) {
                chartData.forEach(data => {
                    const entradaHeight = (data.entrada / overallMax) * 100;
                    const saidaHeight = (data.saida / overallMax) * 100;

                    const barGroup = document.createElement('div');
                    barGroup.className = 'flex flex-col items-center h-full justify-end flex-1';
                    barGroup.innerHTML = `
                        <div class="flex items-end h-full w-full space-x-1 justify-center">
                            <div title="Entradas: ${formatCurrency(data.entrada)}" class="chart-bar bg-green-500 hover:bg-green-400 w-1/2 rounded-t-sm" style="height: ${entradaHeight}%;"></div>
                            <div title="Saídas: ${formatCurrency(data.saida)}" class="chart-bar bg-red-500 hover:bg-red-400 w-1/2 rounded-t-sm" style="height: ${saidaHeight}%;"></div>
                        </div>
                        <div class="text-xs text-center text-gray-600 mt-1">${data.monthLabel}</div>
                    `;
                    transactionsChartContainerEl.appendChild(barGroup);
                });
            } else {
                 transactionsChartContainerEl.innerHTML = '<p class="m-auto text-gray-500">Valores zerados para o gráfico.</p>';
            }
        } else {
            transactionsChartContainerEl.innerHTML = '<p class="m-auto text-gray-500">Sem dados suficientes para o gráfico mensal.</p>';
        }

        loadingIndicatorEl.classList.add('hidden');
        dashboardContentEl.classList.remove('hidden');
    }

    async function init() {
        const transactions = await fetchData();
        if (transactions) {
            updateDashboard(transactions);
        }
    }

    init();
});
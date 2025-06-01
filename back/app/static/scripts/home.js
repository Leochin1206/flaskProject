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
                { "tipo": "saída", "valor": "80.50", "categoria": "Alimentação", "data": "2024-05-03T12:30:00Z", "descricao": "Almoço", "id_usuario": "user1", "data_criacao": "2024-05-03T12:30:00Z" },
                { "tipo": "saída", "valor": "250.00", "categoria": "Transporte", "data": "2024-05-05T08:15:00Z", "descricao": "Combustível", "id_usuario": "user1", "data_criacao": "2024-05-05T08:15:00Z" },
                { "tipo": "entrada", "valor": "200.00", "categoria": "Freelance", "data": "2024-05-10T15:00:00Z", "descricao": "Projeto X", "id_usuario": "user1", "data_criacao": "2024-05-10T15:00:00Z" },
                { "tipo": "saída", "valor": "120.00", "categoria": "Lazer", "data": "2024-05-12T19:45:00Z", "descricao": "Cinema", "id_usuario": "user1", "data_criacao": "2024-05-12T19:45:00Z" },
                { "tipo": "saída", "valor": "50.00", "categoria": "Saúde", "data": "2024-04-20T11:00:00Z", "descricao": "Farmácia", "id_usuario": "user1", "data_criacao": "2024-04-20T11:00:00Z" },
                { "tipo": "entrada", "valor": "3000.00", "categoria": "Salário", "data": "2024-04-01T10:00:00Z", "descricao": "Salário mensal", "id_usuario": "user1", "data_criacao": "2024-04-01T10:00:00Z" },
                { "tipo": "saída", "valor": "150.00", "categoria": "Educação", "data": "2024-03-15T09:00:00Z", "descricao": "Livro técnico", "id_usuario": "user1", "data_criacao": "2024-03-15T09:00:00Z" },
                { "tipo": "entrada", "valor": "50.00", "categoria": "Presente", "data": "2024-05-15T14:20:00Z", "descricao": "Presente de aniversário", "id_usuario": "user1", "data_criacao": "2024-05-15T14:20:00Z"},
                { "tipo": "saída", "valor": "35.00", "categoria": "Alimentação", "data": "2024-05-16T20:00:00Z", "descricao": "Jantar", "id_usuario": "user1", "data_criacao": "2024-05-16T20:00:00Z"},
                { "tipo": "saída", "valor": "400.00", "categoria": "Moradia", "data": "2024-05-05T00:00:00Z", "descricao": "Aluguel", "id_usuario": "user1", "data_criacao": "2024-05-05T00:00:00Z"},
                { "tipo": "entrada", "valor": "100.00", "categoria": "Vendas", "data": "2024-04-25T17:00:00Z", "descricao": "Venda online", "id_usuario": "user1", "data_criacao": "2024-04-25T17:00:00Z"},
                { "tipo": "saída", "valor": "70.00", "categoria": "Contas", "data": "2024-05-10T00:00:00Z", "descricao": "Conta de Internet", "id_usuario": "user1", "data_criacao": "2024-05-10T00:00:00Z"}
            ];

            async function fetchData() {
                try {
                    const response = await fetch(API_URL);
                    if (!response.ok) {
                        console.warn(`HTTP error! status: ${response.status}. Usando dados mocados.`);
                        return mockTransactions;
                    }
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error("Falha ao buscar dados da API:", error);
                    console.warn("Usando dados mocados devido ao erro na API.");
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
                    recentTransactionsBodyEl.innerHTML = '<tr><td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhuma transação encontrada.</td></tr>';
                    categorySummaryEl.innerHTML = '<p class="text-gray-500">Nenhuma categoria para exibir.</p>';
                    transactionsChartContainerEl.innerHTML = '<p class="m-auto text-gray-500">Sem dados para o gráfico.</p>';
                    return;
                }

                let balance = 0;
                transactions.forEach(t => {
                    if (t.tipo === 'entrada') {
                        balance += parseFloat(t.valor);
                    } else if (t.tipo === 'saída') {
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
                        } else if (t.tipo === 'saída') {
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
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    t.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }">
                                    ${t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${t.tipo === 'entrada' ? 'text-green-700' : 'text-red-700'}">${formatCurrency(t.valor)}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${t.categoria}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">${t.descricao || '-'}</td>
                        `;
                    });
                } else {
                     recentTransactionsBodyEl.innerHTML = '<tr><td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Nenhuma transação recente.</td></tr>';
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

                    if (overallMax === 0) { 
                         transactionsChartContainerEl.innerHTML = '<p class="m-auto text-gray-500">Valores zerados para o gráfico.</p>';
                    } else {
                        chartData.forEach(data => {
                            const entradaHeight = overallMax > 0 ? (data.entrada / overallMax) * 100 : 0;
                            const saidaHeight = overallMax > 0 ? (data.saida / overallMax) * 100 : 0;

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
                    }
                } else {
                    transactionsChartContainerEl.innerHTML = '<p class="m-auto text-gray-500">Sem dados suficientes para o gráfico mensal.</p>';
                }

                loadingIndicatorEl.classList.add('hidden');
                dashboardContentEl.classList.remove('hidden');
            }

            async function init() {
                const transactions = await fetchData();
                updateDashboard(transactions);
            }
            init();
        });
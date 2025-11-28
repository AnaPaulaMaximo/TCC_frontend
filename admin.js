const API_BASE_URL = 'https://tcc-backend-repensei.onrender.com';

let chartPlano = null;
let chartQuizzes = null; 

// Estado dos Filtros
let currentSearch = '';
let currentPlano = '';
let debounceTimer;

// Verificação de Sessão
document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession(); 
    
    document.getElementById('adminLogoutBtn').addEventListener('click', handleLogout);

    setupMenuLinks();
    setupModalButtons();
    setupFilters();
    setupMobileSidebar(); // Nova função para menu responsivo
});

// ===== NOVA FUNCIONALIDADE: MENU LATERAL RESPONSIVO =====

// admin.js - Atualize esta função
function setupMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('menuOverlay');
    const openBtn = document.getElementById('openSidebarBtn');
    const closeBtn = document.getElementById('closeSidebarBtn'); // Se houver botão X no menu
    
    if (!sidebar || !openBtn) return;

    // ABRIR
    openBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Impede fechamento imediato
        
        // Remove classe que esconde (Tailwind)
        sidebar.classList.remove('-translate-x-full');
        // Adiciona classe que mostra (Style.css)
        sidebar.classList.add('sidebar-visible');
        
        if (overlay) overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Trava scroll da página
    });
    
    // FECHAR
    const closeSidebar = () => {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('sidebar-visible');
        if (overlay) overlay.classList.add('hidden');
        document.body.style.overflow = '';
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
}

async function checkAdminSession() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/check_session`, {
            credentials: 'include' 
        });

        if (!response.ok) {
            throw new Error('Sessão de admin inválida.');
        }

        const data = await response.json();
        document.getElementById('adminName').textContent = data.admin.nome;
        
        loadDashboardData();
        loadAlunosTable();

    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        showNotification("Você não está logado como admin. Redirecionando...", 'error');
        setTimeout(() => {
            window.location.href = 'login.html'; 
        }, 1500);
    }
}

async function handleLogout() {
    try {
        await fetch(`${API_BASE_URL}/admin/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
    } finally {
        sessionStorage.clear();
        window.location.href = 'login.html'; 
    }
}

// Navegação do Menu
function setupMenuLinks() {
    document.querySelectorAll('.admin-menu-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. NAVEGAÇÃO (Troca a tela)
            const targetId = link.getAttribute('href').substring(1); 
            
            document.querySelectorAll('.admin-tela').forEach(tela => {
                tela.classList.toggle('hidden', tela.id !== `tela-${targetId}`);
            });

            // Atualiza destaque do link
            document.querySelectorAll('.admin-menu-link').forEach(l => l.classList.remove('bg-purple-900'));
            link.classList.add('bg-purple-900');
            
            // Carrega dados se necessário
            if (targetId === 'dashboard') loadDashboardData();
            if (targetId === 'alunos') loadAlunosTable();

            // 2. FECHAR MENU (Apenas se estiver no mobile)
            if (window.innerWidth < 1024) {
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('menuOverlay');
                
                if (sidebar) {
                    sidebar.classList.add('-translate-x-full'); // Tailwind hide
                    sidebar.classList.remove('sidebar-visible'); // CSS hide
                }
                if (overlay) overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    });
}

// Carregamento de Dados
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Falha ao carregar estatísticas.');

        const data = await response.json();

        // Preenche os cards
        document.getElementById('statTotalAlunos').textContent = data.total_alunos;
        document.getElementById('statMediaGeral').textContent = data.media_geral_acertos;
        document.getElementById('statMediaFilosofia').textContent = data.media_filosofia;
        document.getElementById('statMediaSociologia').textContent = data.media_sociologia;

        // Gráfico 1: Alunos por Plano
        renderChartPlanos(
            data.alunos_por_plano.map(p => p.plano),
            data.alunos_por_plano.map(p => p.count)
        );

        // Gráfico 2: Quizzes por Tema e Plano
        renderChartQuizzesGrouped(
            data.quizzes_por_plano_e_tema.labels,
            data.quizzes_por_plano_e_tema.data_filosofia,
            data.quizzes_por_plano_e_tema.data_sociologia
        );

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showNotification(error.message, 'error');
    }
}

async function loadAlunosTable() {
    const tabelaBody = document.getElementById('tabelaAlunosBody');
    tabelaBody.innerHTML = `<tr><td colspan="8" class="p-6 md:p-8 text-center text-gray-500">Carregando alunos...</td></tr>`;

    const url = new URL(`${API_BASE_URL}/admin/alunos`);
    if (currentSearch) {
        url.searchParams.append('search', currentSearch);
    }
    if (currentPlano) {
        url.searchParams.append('plano', currentPlano);
    }

    try {
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error('Falha ao carregar lista de alunos.');

        const alunos = await response.json();
        tabelaBody.innerHTML = ''; 

        if (alunos.length === 0) {
            tabelaBody.innerHTML = `<tr><td colspan="8" class="p-6 md:p-8 text-center text-gray-500">Nenhum aluno encontrado.</td></tr>`;
            return;
        }

        alunos.forEach(aluno => {
            const tr = document.createElement('tr');
            tr.className = 'border-b border-gray-100 hover:bg-gray-50 transition';
            
            const mediaFilo = aluno.media_filosofia ? (aluno.media_filosofia * 100).toFixed(0) + '%' : 'N/A';
            const mediaSocio = aluno.media_sociologia ? (aluno.media_sociologia * 100).toFixed(0) + '%' : 'N/A';
            const mediaGeral = aluno.media_geral ? (aluno.media_geral * 100).toFixed(0) + '%' : 'N/A';
            
            tr.innerHTML = `
                <td class="p-2 md:p-4">
                    <div class="flex items-center gap-2 md:gap-3">
                        <img src="${aluno.url_foto || 'static/img/ft_perfil.png'}" alt="Foto" class="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover">
                        <div>
                            <p class="font-semibold text-gray-800 text-sm md:text-base">${aluno.nome}</p>
                            <span class="text-xs text-gray-500">ID: ${aluno.id_aluno}</span>
                        </div>
                    </div>
                </td>
                <td class="p-2 md:p-4 text-gray-700 text-sm md:text-base hidden sm:table-cell">${aluno.email}</td>
                <td class="p-2 md:p-4">
                    <span class="px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${aluno.plano === 'premium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}">
                        ${aluno.plano}
                    </span>
                </td>
                <td class="p-2 md:p-4 text-gray-700 font-medium text-center text-sm md:text-base hidden md:table-cell">${aluno.total_quizzes}</td>
                <td class="p-2 md:p-4 text-gray-700 font-medium text-sm md:text-base hidden lg:table-cell">${mediaFilo}</td>
                <td class="p-2 md:p-4 text-gray-700 font-medium text-sm md:text-base hidden lg:table-cell">${mediaSocio}</td>
                <td class="p-2 md:p-4 text-gray-700 font-bold text-sm md:text-base hidden md:table-cell">${mediaGeral}</td>
                <td class="p-2 md:p-4">
                    <div class="flex gap-1">
                        <button class="text-blue-500 hover:text-blue-700 p-1" data-action="resultados" title="Ver Resultados">
                            <span class="material-icons text-base md:text-lg">bar_chart</span>
                        </button>
                        <button class="text-purple-500 hover:text-purple-700 p-1" data-action="editar" title="Editar">
                            <span class="material-icons text-base md:text-lg">edit</span>
                        </button>
                        <button class="text-red-500 hover:text-red-700 p-1" data-action="excluir" title="Excluir">
                            <span class="material-icons text-base md:text-lg">delete</span>
                        </button>
                    </div>
                </td>
            `;

            tr.querySelector('[data-action="editar"]').addEventListener('click', () => openModalEdit(aluno));
            tr.querySelector('[data-action="excluir"]').addEventListener('click', () => handleExcluirAluno(aluno.id_aluno, aluno.nome));
            tr.querySelector('[data-action="resultados"]').addEventListener('click', () => openModalResultados(aluno.id_aluno, aluno.nome));
            
            tabelaBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        showNotification(error.message, 'error');
        tabelaBody.innerHTML = `<tr><td colspan="8" class="p-6 md:p-8 text-center text-red-500">Erro ao carregar alunos.</td></tr>`;
    }
}

// Lógica dos Filtros
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterPlano = document.getElementById('filterPlano');

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            loadAlunosTable();
        }, 300);
    });

    filterPlano.addEventListener('change', (e) => {
        currentPlano = e.target.value;
        loadAlunosTable();
    });
}

// Lógica dos Modais
function setupModalButtons() {
    const modal = document.getElementById('modalAluno');
    const btnNovo = document.getElementById('btnNovoAluno');
    const btnFechar = document.getElementById('fecharModalAluno');
    const btnSalvar = document.getElementById('salvarAlunoBtn');

    btnNovo.addEventListener('click', openModalNew);
    btnFechar.addEventListener('click', () => modal.classList.add('hidden'));
    btnSalvar.addEventListener('click', handleSalvarAluno);
    
    document.getElementById('fecharModalResultados').addEventListener('click', () => {
        document.getElementById('modalResultados').classList.add('hidden');
    });
}

function openModalNew() {
    document.getElementById('modalAlunoTitulo').textContent = 'Novo Aluno';
    document.getElementById('alunoId').value = '';
    document.getElementById('alunoNome').value = '';
    document.getElementById('alunoEmail').value = '';
    document.getElementById('alunoPlano').value = 'freemium';
    document.getElementById('alunoSenha').value = ''; 
    document.getElementById('alunoSenha').placeholder = 'Senha (obrigatório)';
    document.getElementById('modalAluno').classList.remove('hidden');
}

function openModalEdit(aluno) {
    document.getElementById('modalAlunoTitulo').textContent = 'Editar Aluno';
    document.getElementById('alunoId').value = aluno.id_aluno;
    document.getElementById('alunoNome').value = aluno.nome;
    document.getElementById('alunoEmail').value = aluno.email;
    document.getElementById('alunoPlano').value = aluno.plano;
    document.getElementById('alunoSenha').value = ''; 
    document.getElementById('alunoSenha').placeholder = 'Deixe em branco para não alterar';
    document.getElementById('modalAluno').classList.remove('hidden');
}

async function handleSalvarAluno() {
    const id = document.getElementById('alunoId').value;
    const nome = document.getElementById('alunoNome').value;
    const email = document.getElementById('alunoEmail').value;
    const plano = document.getElementById('alunoPlano').value;
    const senha = document.getElementById('alunoSenha').value;

    const modal = document.getElementById('modalAluno');
    const btnSalvar = document.getElementById('salvarAlunoBtn');
    
    const isEditing = !!id;
    const url = isEditing ? `${API_BASE_URL}/admin/alunos/${id}` : `${API_BASE_URL}/admin/alunos`;
    const method = isEditing ? 'PUT' : 'POST';

    let body = { nome, email, plano };
    if (senha) { 
        body.senha = senha;
    }
    if (!isEditing && !senha) {
        showNotification('Senha é obrigatória para criar um novo aluno.', 'error');
        return;
    }

    btnSalvar.disabled = true;
    btnSalvar.textContent = "Salvando...";

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao salvar aluno.');
        }

        showNotification(data.message, 'success');
        modal.classList.add('hidden');
        loadAlunosTable(); 
        loadDashboardData(); 

    } catch (error) {
        console.error('Erro ao salvar aluno:', error);
        showNotification(error.message, 'error');
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.textContent = "Salvar";
    }
}

async function handleExcluirAluno(id, nome) {
    showConfirmModal(
        `Tem certeza que deseja remover o aluno <b>${nome}</b>?<br>Esta ação não pode ser desfeita.`, 
        async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin/alunos/${id}`, { 
                    method: 'DELETE',
                    credentials: 'include'
                });
                
                let data = {};
                try {
                    data = await response.json();
                } catch(e) {}

                if (response.ok) {
                    showNotification('Aluno removido com sucesso!', 'success');
                    loadAlunosTable(); 
                    loadDashboardData();
                } else {
                    showNotification(data.error || 'Erro ao remover aluno.', 'error');
                }
            } catch (error) {
                console.error('Erro de rede:', error);
                showNotification('Erro de conexão ao tentar excluir.', 'error');
            }
        },
        'Confirmar Exclusão'
    );
}

async function openModalResultados(id, nome) {
    const modal = document.getElementById('modalResultados');
    const titulo = document.getElementById('modalResultadosTitulo');
    const container = document.getElementById('listaResultadosContainer');
    
    titulo.textContent = `Resultados de: ${nome}`;
    container.innerHTML = '<p class="text-gray-500 text-center text-sm md:text-base">Carregando resultados...</p>';
    modal.classList.remove('hidden');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/alunos/${id}/resultados`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Falha ao carregar resultados.');

        const resultados = await response.json();
        
        if (resultados.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center text-sm md:text-base">Nenhum resultado de quiz encontrado para este aluno.</p>';
            return;
        }

        container.innerHTML = ''; 
        resultados.forEach(res => {
            const dataFormatada = new Date(res.data_criacao).toLocaleString('pt-BR');
            const perc = res.total_perguntas > 0 ? (res.acertos / res.total_perguntas) * 100 : 0;
            
            const div = document.createElement('div');
            div.className = 'p-3 md:p-4 border-b border-gray-200';
            div.innerHTML = `
                <div class="flex justify-between items-center mb-1">
                    <span class="font-semibold text-purple-700 text-sm md:text-base">${res.tema}</span>
                    <span class="font-bold text-base md:text-lg ${perc >= 70 ? 'text-green-600' : 'text-red-500'}">
                        ${perc.toFixed(0)}%
                    </span>
                </div>
                <div class="flex justify-between items-center text-xs md:text-sm text-gray-500">
                    <span>${res.acertos} de ${res.total_perguntas} corretas</span>
                    <span class="text-xs">${dataFormatada}</span>
                </div>
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error('Erro ao carregar resultados:', error);
        container.innerHTML = `<p class="text-red-500 text-center text-sm md:text-base">${error.message}</p>`;
        showNotification(error.message, 'error');
    }
}

// Funções dos Gráficos (Chart.js)
function renderChartPlanos(labels, data) {
    const ctx = document.getElementById('chartAlunosPlano');
    if (!ctx) return;
    
    if (chartPlano) chartPlano.destroy(); 
    
    const backgroundColors = labels.map(label => {
        if (label === 'premium') return 'rgba(234, 179, 8, 0.7)';
        if (label === 'freemium') return 'rgba(59, 130, 246, 0.7)';
        return 'rgba(168, 85, 247, 0.7)'; 
    });
    const borderColors = labels.map(label => {
        if (label === 'premium') return 'rgba(234, 179, 8, 1)';
        if (label === 'freemium') return 'rgba(59, 130, 246, 1)';
        return 'rgba(168, 85, 247, 1)';
    });

    chartPlano = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Alunos por Plano',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { 
                legend: { 
                    position: 'top',
                    labels: {
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12
                        }
                    }
                } 
            }
        }
    });
}

function renderChartQuizzesGrouped(labels, dataFilosofia, dataSociologia) {
    const ctx = document.getElementById('chartQuizzesGrouped');
    if (!ctx) return;
    
    if (chartQuizzes) chartQuizzes.destroy();
    
    chartQuizzes = new Chart(ctx.getContext('2d'), {
        type: 'bar', 
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Filosofia',
                    data: dataFilosofia,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Sociologia',
                    data: dataSociologia,
                    backgroundColor: 'rgba(236, 72, 153, 0.7)',
                    borderColor: 'rgba(236, 72, 153, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { 
                        stepSize: 1, 
                        precision: 0,
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12
                        }
                    } 
                },
                x: {
                    ticks: {
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12
                        }
                    }
                }
            },
            plugins: {
                legend: { 
                    display: true, 
                    position: 'top',
                    labels: {
                        font: {
                            size: window.innerWidth < 768 ? 10 : 12
                        }
                    }
                }
            }
        }
    });
}

// Redimensionar gráficos ao mudar orientação/tamanho da tela
window.addEventListener('resize', () => {
    if (chartPlano) {
        chartPlano.options.plugins.legend.labels.font.size = window.innerWidth < 768 ? 10 : 12;
        chartPlano.update();
    }
    if (chartQuizzes) {
        chartQuizzes.options.scales.y.ticks.font.size = window.innerWidth < 768 ? 10 : 12;
        chartQuizzes.options.scales.x.ticks.font.size = window.innerWidth < 768 ? 10 : 12;
        chartQuizzes.options.plugins.legend.labels.font.size = window.innerWidth < 768 ? 10 : 12;
        chartQuizzes.update();
    }
});

/* ==========================================================================
   UTILITÁRIOS: MODAIS E NOTIFICAÇÕES
   ========================================================================== */

function showNotification(message, type = 'success') {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm';
        document.body.appendChild(container);
    }

    const isError = type === 'error';
    const iconName = isError ? 'error' : 'check_circle';
    const iconColor = isError ? 'text-red-600' : 'text-purple-600';
    const title = isError ? 'Ocorreu um Erro' : 'Sucesso!';

    const toast = document.createElement('div');
    toast.className = 'flex items-start gap-2 md:gap-3 w-full p-3 md:p-4 bg-white rounded-xl shadow-lg border border-gray-200'; 
    
    toast.style.animation = "slideIn 0.3s ease-out forwards";
    
    toast.innerHTML = `
        <div class="flex-shrink-0">
            <span class="material-icons ${iconColor}" style="font-size: 20px;">${iconName}</span>
        </div>
        <div class="flex-1 mr-2">
            <p class="font-semibold text-gray-900 text-sm md:text-base">${title}</p>
            <p class="text-xs md:text-sm text-gray-600">${message}</p>
        </div>
        <div class="flex-shrink-0">
            <button class="text-gray-400 hover:text-gray-600 btn-close-toast">
                <span class="material-icons" style="font-size: 18px;">close</span>
            </button>
        </div>
    `;

    container.appendChild(toast);

    const removeToast = () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    };

    const timer = setTimeout(removeToast, 4000);

    toast.querySelector('.btn-close-toast').addEventListener('click', () => {
        clearTimeout(timer);
        removeToast();
    });
}

function showConfirmModal(message, onConfirm, title = 'Tem certeza?') {
    if (document.getElementById('custom-confirm-modal')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'custom-confirm-modal';
    backdrop.className = 'fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300 p-4';

    const modal = document.createElement('div');
    modal.className = 'bg-white rounded-2xl shadow-2xl p-4 md:p-6 w-full max-w-md transform scale-95 transition-all duration-300 border border-gray-100';

    modal.innerHTML = `
        <div class="flex flex-col items-center text-center">
            <div class="w-12 h-12 md:w-16 md:h-16 bg-red-50 rounded-full flex items-center justify-center mb-3 md:mb-4">
                <span class="material-icons text-red-500" style="font-size: 24px;">warning</span>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-2">${title}</h3>
            <p class="text-gray-600 mb-4 md:mb-6 text-xs md:text-sm leading-relaxed">${message}</p>
            <div class="flex w-full gap-2 md:gap-3">
                <button id="btn-cancel" class="flex-1 px-3 md:px-4 py-2 md:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm md:text-base">Cancelar</button>
                <button id="btn-confirm" class="flex-1 px-3 md:px-4 py-2 md:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg shadow-red-200 transition-all text-sm md:text-base">Sim, excluir</button>
            </div>
        </div>
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    const closeModal = () => {
        backdrop.classList.remove('opacity-100');
        modal.classList.remove('scale-100');
        modal.classList.add('scale-95');
        setTimeout(() => { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); }, 300);
    };

    requestAnimationFrame(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        modal.classList.remove('scale-95');
        modal.classList.add('scale-100');
    });

    modal.querySelector('#btn-cancel').addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

    modal.querySelector('#btn-confirm').addEventListener('click', () => {
        onConfirm(); 
        closeModal();
    });
}
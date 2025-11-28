/**
 * Exibe notificações
 */
function showNotification(message, type = 'success') {
    let container = document.getElementById('notification-container');
    if (!container) return;

    const isError = type === 'error';
    const iconName = isError ? 'error' : 'check_circle';
    const iconColor = isError ? 'text-red-600' : 'text-green-600';
    const title = isError ? 'Erro' : 'Sucesso';

    const toast = document.createElement('div');
    toast.className = 'flex items-start gap-3 w-full max-w-sm p-4 bg-white rounded-xl shadow-lg border border-gray-200 notification-toast-enter';
    toast.innerHTML = `
        <div class="flex-shrink-0"><span class="material-icons ${iconColor}">${iconName}</span></div>
        <div class="flex-1 mr-4"><p class="font-semibold text-gray-900">${title}</p><p class="text-sm text-gray-600">${message}</p></div>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Configurações
const API_BASE_URL = 'https://tcc-backend-repensei.onrender.com';
let currentUser = null;

// Verificar Login ao carregar
document.addEventListener('DOMContentLoaded', () => {
    const storedUser = sessionStorage.getItem('currentUser');
    
    if (!storedUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // CORREÇÃO AQUI: Mapeando corretamente os dados do usuário
    const userData = JSON.parse(storedUser);
    currentUser = {
        id: userData.id_aluno, // Agora usa id_aluno corretamente
        nome: userData.nome,
        email: userData.email,
        plano: userData.plano
    };
    
    console.log("Usuário carregado para cancelamento:", currentUser);

    // Se o usuário já for freemium, não deveria estar aqui
    if (currentUser.plano === 'freemium') {
        // Opcional: redirecionar ou apenas avisar
        // window.location.href = 'freemium.html';
    }
});

// Lógica do Modal
const modal = document.getElementById('modalConfirmacao');
const btnIniciar = document.getElementById('btnIniciarCancelamento');
const btnConfirmar = document.getElementById('btnConfirmarCancelamento');

if (btnIniciar) {
    btnIniciar.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });
}

window.fecharModal = function() {
    modal.classList.add('hidden');
}

// LÓGICA DE CANCELAMENTO (DOWNGRADE)
if (btnConfirmar) {
    btnConfirmar.addEventListener('click', async () => {
        // Verifica o ID corretamente agora
        if (!currentUser || !currentUser.id) {
            showNotification("Erro: Usuário não identificado.", "error");
            return;
        }

        // Muda texto do botão para feedback visual
        const originalText = btnConfirmar.innerText;
        btnConfirmar.disabled = true;
        btnConfirmar.innerText = "Processando...";

        // Dados para o downgrade
        const updateData = {
            plano: 'freemium'
        };

        try {
            // 1. Chama a API
            console.log(`Enviando requisição para: ${API_BASE_URL}/auth/editar_usuario/${currentUser.id}`);
            
            const response = await fetch(`${API_BASE_URL}/auth/editar_usuario/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao cancelar plano.");
            }

            // 2. Atualiza SessionStorage com o novo plano
            // Precisamos recuperar o objeto original para manter outros dados (como foto)
            const sessionData = JSON.parse(sessionStorage.getItem('currentUser'));
            sessionData.plano = 'freemium';
            sessionStorage.setItem('currentUser', JSON.stringify(sessionData));

            // 3. Feedback e Redirecionamento
            showNotification("Plano cancelado com sucesso. Você voltará ao Freemium.");
            
            setTimeout(() => {
                window.location.href = 'freemium.html';
            }, 2000);

        } catch (error) {
            console.error(error);
            showNotification(error.message, 'error');
            btnConfirmar.disabled = false;
            btnConfirmar.innerText = originalText;
            
            // Se o erro for "Nenhum campo para atualizar", significa que o Backend
            // ainda não foi atualizado com o código auth_routes.py que enviei anteriormente.
            if (error.message.includes("Nenhum campo")) {
                showNotification("Erro no servidor: Backend não aceitou a mudança de plano.", 'error');
            }
            
            fecharModal();
        }
    });
}
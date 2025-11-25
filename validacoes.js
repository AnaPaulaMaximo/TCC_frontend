// ===================================================================
// SALVAR ESTE CÓDIGO COMO: validacoes.js (criar arquivo separado)
// E INCLUIR NO HTML ANTES DO login.js
// ===================================================================

// ===================================================================
// login.js - VERSÃO COMPLETA COM VALIDAÇÕES
// ===================================================================

/**
 * NOTIFICAÇÃO.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} [type='success'] - O tipo de notificação ('success' ou 'error').
 */
function showNotification(message, type = 'success') {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-8 right-8 z-[9999] flex flex-col gap-3';
        document.body.appendChild(container);
    }

    const isError = type === 'error';
    const iconName = isError ? 'error' : 'check_circle';
    const iconColor = isError ? 'text-red-600' : 'text-purple-600';
    const title = isError ? 'Ocorreu um Erro' : 'Sucesso!';

    const toast = document.createElement('div');
    toast.className = 'flex items-start gap-3 w-full max-w-sm p-4 bg-white rounded-xl shadow-lg border border-gray-200 notification-toast-enter';
    
    toast.innerHTML = `
        <div class="flex-shrink-0">
            <span class="material-icons ${iconColor}" style="font-size: 24px;">
                ${iconName}
            </span>
        </div>
        <div class="flex-1 mr-4">
            <p class="font-semibold text-gray-900">${title}</p>
            <p class="text-sm text-gray-600">${message}</p>
        </div>
        <div class="flex-shrink-0">
            <button class="text-gray-400 hover:text-gray-600">
                <span class="material-icons" style="font-size: 20px;">close</span>
            </button>
        </div>
    `;

    container.appendChild(toast);

    const timer = setTimeout(() => {
        toast.classList.remove('notification-toast-enter');
        toast.classList.add('notification-toast-exit');
        
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);

    toast.querySelector('button').addEventListener('click', () => {
        clearTimeout(timer);
        toast.classList.remove('notification-toast-enter');
        toast.classList.add('notification-toast-exit');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    });
}

// URL da API
const API_BASE_URL = 'http://127.0.0.1:5000';

// Funções para abrir/fechar modais
window.abrirLogin = function () {
    document.getElementById('modalLogin').classList.remove('hidden');
}
window.fecharLogin = function () {
    document.getElementById('modalLogin').classList.add('hidden');
}
window.abrirCriarConta = function () {
    document.getElementById('modalCriarConta').classList.remove('hidden');
}
window.fecharCriarConta = function () {
    document.getElementById('modalCriarConta').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {

    // Redireciona se já estiver logado
    if (sessionStorage.getItem('currentUser')) {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (user.plano === 'premium') {
            window.location.href = 'premium.html';
        } else {
            window.location.href = 'freemium.html';
        }
    }
    
    if (sessionStorage.getItem('currentAdmin')) {
        window.location.href = 'admin.html';
    }

    // ===================================================================
    // BOTÃO DE LOGIN
    // ===================================================================
    document.getElementById('entrarBtn').addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginSenha').value;

        if (!email || !senha) {
            showNotification('Preencha e-mail e senha.', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
                credentials: 'include' 
            });
            
            if (!response.ok) {
                let errorData = { error: `Erro HTTP: ${response.status} ${response.statusText}` };
                try {
                    errorData = await response.json();
                } catch (e) {}
                throw new Error(errorData.error || `Erro ${response.status}`);
            }

            const data = await response.json();
            
            if (data.role === 'admin') {
                sessionStorage.setItem('currentAdmin', JSON.stringify(data.user));
                window.location.href = 'admin.html';
            } else if (data.role === 'aluno') {
                sessionStorage.setItem('currentUser', JSON.stringify(data.user));
                
                if (data.user.plano === 'premium') {
                    window.location.href = 'premium.html';
                } else {
                    window.location.href = 'freemium.html';
                }
            } else {
                throw new Error("Tipo de usuário desconhecido recebido do servidor.");
            }

        } catch (error) {
            console.error('Erro ao conectar com a API de login:', error);
            showNotification(`Erro ao fazer login: ${error.message}.`, 'error');
        }
    });

    // ===================================================================
    // BOTÃO DE CRIAR CONTA - COM VALIDAÇÕES COMPLETAS
    // ===================================================================
    document.getElementById('criarContaBtn').addEventListener('click', async () => {
        const nome = document.getElementById('cadastroNome').value.trim();
        const email = document.getElementById('cadastroEmail').value.trim().toLowerCase();
        const senha = document.getElementById('cadastroSenha').value;
        const confirmarSenha = document.getElementById('cadastroConfirmarSenha').value;

        // ===== VALIDAÇÕES FRONTEND =====
        let temErro = false;
        
        // 1. Validar nome
        const resultadoNome = window.validacoesCadastro.validarNome(nome);
        if (!resultadoNome.valida) {
            window.validacoesCadastro.mostrarErrosValidacao('cadastroNome', resultadoNome.erros);
            temErro = true;
        } else {
            window.validacoesCadastro.limparErrosValidacao('cadastroNome');
        }
        
        // 2. Validar e-mail
        if (!window.validacoesCadastro.validarEmail(email)) {
            window.validacoesCadastro.mostrarErrosValidacao('cadastroEmail', ['Formato de e-mail inválido']);
            temErro = true;
        } else {
            window.validacoesCadastro.limparErrosValidacao('cadastroEmail');
        }
        
        // 3. Validar senha
        const resultadoSenha = window.validacoesCadastro.validarSenha(senha);
        if (!resultadoSenha.valida) {
            window.validacoesCadastro.mostrarErrosValidacao('cadastroSenha', resultadoSenha.erros);
            temErro = true;
        } else {
            window.validacoesCadastro.limparErrosValidacao('cadastroSenha');
        }
        
        // 4. Validar confirmação de senha
        if (!window.validacoesCadastro.validarConfirmacaoSenha(senha, confirmarSenha)) {
            window.validacoesCadastro.mostrarErrosValidacao('cadastroConfirmarSenha', ['As senhas não coincidem']);
            temErro = true;
        } else {
            window.validacoesCadastro.limparErrosValidacao('cadastroConfirmarSenha');
        }
        
        // Se houver erro, parar aqui
        if (temErro) {
            showNotification('Por favor, corrija os erros antes de continuar.', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/cadastrar_usuario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha }),
                credentials: 'include' 
            });
            
            if (!response.ok) {
                let errorData = { error: `Erro HTTP: ${response.status} ${response.statusText}` };
                try {
                    errorData = await response.json();
                } catch (e) {}
                
                // Mostrar erros específicos do backend
                if (errorData.detalhes) {
                    window.validacoesCadastro.mostrarErrosValidacao('cadastroSenha', errorData.detalhes);
                }
                
                throw new Error(errorData.error || `Erro ${response.status}`);
            }

            const data = await response.json();
            
            showNotification(data.message || 'Conta criada com sucesso!');
            fecharCriarConta();
            
            // Limpar campos
            document.getElementById('cadastroNome').value = '';
            document.getElementById('cadastroEmail').value = '';
            document.getElementById('cadastroSenha').value = '';
            document.getElementById('cadastroConfirmarSenha').value = '';
            
            // Resetar indicador de força
            const barra = document.getElementById('barraSenha');
            const texto = document.getElementById('textoSenha');
            if (barra) barra.style.width = '0%';
            if (texto) texto.textContent = '';
            
            // Limpar erros
            window.validacoesCadastro.limparErrosValidacao('cadastroNome');
            window.validacoesCadastro.limparErrosValidacao('cadastroEmail');
            window.validacoesCadastro.limparErrosValidacao('cadastroSenha');
            window.validacoesCadastro.limparErrosValidacao('cadastroConfirmarSenha');
            
            abrirLogin();

        } catch (error) {
            console.error('Erro ao conectar com a API de cadastro:', error);
            showNotification(`Erro ao criar conta: ${error.message}.`, 'error');
        }
    });
});
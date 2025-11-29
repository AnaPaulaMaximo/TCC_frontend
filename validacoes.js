// ===================================================================
// CONFIGURAÇÃO DA API
// ===================================================================

const API_BASE_URL = 'https://tcc-backend-repensei.onrender.com';

console.log('✅ validacoes.js carregado com sucesso!');
console.log('🔗 API Base URL:', API_BASE_URL);

// ===================================================================
// NOTIFICAÇÃO
// ===================================================================

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

// ===================================================================
// FUNÇÕES PARA ABRIR/FECHAR MODAIS
// ===================================================================

window.abrirLogin = function () {
    console.log('📂 Abrindo modal de login');
    document.getElementById('modalLogin').classList.remove('hidden');
}

window.fecharLogin = function () {
    console.log('📂 Fechando modal de login');
    document.getElementById('modalLogin').classList.add('hidden');
}

window.abrirCriarConta = function () {
    console.log('📂 Abrindo modal de criar conta');
    document.getElementById('modalCriarConta').classList.remove('hidden');
}

window.fecharCriarConta = function () {
    console.log('📂 Fechando modal de criar conta');
    document.getElementById('modalCriarConta').classList.add('hidden');
}

// ===================================================================
// VALIDAÇÕES
// ===================================================================

const validacoesCadastro = {
    
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    senhasComuns: [
        '123456', '123456789', 'qwerty', 'password', '12345678',
        '111111', '123123', '1234567890', '1234567', 'senha',
        'senha123', 'admin', 'admin123', 'root', '12345',
        'password123', 'abc123', '1q2w3e4r', 'qwerty123', 'letmein'
    ],

    validarSenha(senha) {
        const erros = [];
        
        if (senha.length < 8) {
            erros.push('A senha deve ter no mínimo 8 caracteres');
        }
        
        if (senha.length > 128) {
            erros.push('A senha deve ter no máximo 128 caracteres');
        }
        
        if (!/[A-Z]/.test(senha)) {
            erros.push('Deve conter pelo menos uma letra maiúscula');
        }
        
        if (!/[a-z]/.test(senha)) {
            erros.push('Deve conter pelo menos uma letra minúscula');
        }
        
        if (!/[0-9]/.test(senha)) {
            erros.push('Deve conter pelo menos um número');
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
            erros.push('Deve conter pelo menos um caractere especial (!@#$%&*)');
        }
        
        if (this.senhasComuns.includes(senha.toLowerCase())) {
            erros.push('Esta senha é muito comum. Escolha uma senha mais segura');
        }
        
        if (/(.)\1{2,}/.test(senha)) {
            erros.push('Evite repetir o mesmo caractere mais de 2 vezes seguidas');
        }
        
        return {
            valida: erros.length === 0,
            erros: erros
        };
    },

    validarConfirmacaoSenha(senha, confirmacao) {
        return senha === confirmacao;
    },

    validarNome(nome) {
        const erros = [];
        
        nome = nome.trim();
        
        if (nome.length < 3) {
            erros.push('O nome deve ter no mínimo 3 caracteres');
        }
        
        if (nome.length > 100) {
            erros.push('O nome deve ter no máximo 100 caracteres');
        }
        
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) {
            erros.push('O nome deve conter apenas letras');
        }
        
        return {
            valida: erros.length === 0,
            erros: erros,
            nomeFormatado: nome
        };
    },

    atualizarForcaSenha(senha) {
        const container = document.getElementById('forcaSenhaContainer');
        const barra = document.getElementById('barraSenha');
        const texto = document.getElementById('textoSenha');
        
        if (!container || !barra || !texto) return;
        
        let forca = 0;
        let corClass = '';
        let mensagem = '';
        
        if (senha.length >= 8) forca++;
        if (senha.length >= 12) forca++;
        if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) forca++;
        if (/[0-9]/.test(senha)) forca++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) forca++;
        if (senha.length >= 16) forca++;
        
        if (forca <= 2) {
            corClass = 'bg-red-500';
            mensagem = 'Fraca';
        } else if (forca <= 4) {
            corClass = 'bg-yellow-500';
            mensagem = 'Média';
        } else {
            corClass = 'bg-green-500';
            mensagem = 'Forte';
        }
        
        const largura = (forca / 6) * 100;
        barra.className = `h-full rounded transition-all duration-300 ${corClass}`;
        barra.style.width = `${largura}%`;
        texto.textContent = mensagem;
        texto.className = `text-sm font-medium ${corClass.replace('bg-', 'text-')}`;
    },

    mostrarErrosValidacao(campo, erros) {
        const input = document.getElementById(campo);
        if (!input) return;
        
        let container = input.closest('.w-full');
        if (!container) {
            container = input.parentElement;
        }
        
        const erroAnterior = container.querySelector('.erro-validacao');
        if (erroAnterior) {
            erroAnterior.remove();
        }
        
        if (erros.length > 0) {
            input.classList.add('border-red-500', 'border-2');
            
            const divErro = document.createElement('div');
            divErro.className = 'erro-validacao text-red-600 text-xs mt-2 px-1';
            divErro.innerHTML = erros.map(e => `• ${e}`).join('<br>');
            
            const inputWrapper = input.parentElement;
            if (inputWrapper.classList.contains('relative')) {
                inputWrapper.parentElement.insertBefore(divErro, inputWrapper.nextSibling);
            } else {
                input.parentElement.insertBefore(divErro, input.nextSibling);
            }
        } else {
            input.classList.remove('border-red-500', 'border-2');
        }
    },

    limparErrosValidacao(campo) {
        const input = document.getElementById(campo);
        if (!input) return;
        
        input.classList.remove('border-red-500', 'border-2');
        
        let container = input.closest('.w-full');
        if (!container) {
            container = input.parentElement;
        }
        
        const erros = container.querySelectorAll('.erro-validacao');
        erros.forEach(erro => erro.remove());
    }
};

window.validacoesCadastro = validacoesCadastro;

// ===================================================================
// INICIALIZAÇÃO
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Carregado - Inicializando...');

    // 🔥 Verificar se já está logado ANTES de mostrar login
    const userSession = sessionStorage.getItem('currentUser');
    const adminSession = sessionStorage.getItem('currentAdmin');
    
    if (userSession) {
        console.log('👤 Usuário já logado, redirecionando...');
        const user = JSON.parse(userSession);
        window.location.href = user.plano === 'premium' ? 'premium.html' : 'freemium.html';
        return;
    }
    
    if (adminSession) {
        console.log('👤 Admin já logado, redirecionando...');
        window.location.href = 'admin.html';
        return;
    }
    
    console.log('✅ Nenhuma sessão ativa, continuando na tela de login');
    
    // ===================================================================
    // CONFIGURAR TOGGLE DE SENHA
    // ===================================================================
    
    function setupPasswordToggle(inputId, buttonId, iconId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        const icon = document.getElementById(iconId);
        
        if (!input || !button || !icon) {
            console.warn(`⚠️ Toggle de senha não encontrado: ${inputId}`);
            return;
        }
        
        button.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            icon.textContent = isPassword ? 'visibility' : 'visibility_off';
            button.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
        });
    }
    
    setupPasswordToggle('loginSenha', 'toggleLoginSenha', 'iconLoginSenha');
    setupPasswordToggle('cadastroSenha', 'toggleCadastroSenha', 'iconCadastroSenha');
    setupPasswordToggle('cadastroConfirmarSenha', 'toggleCadastroConfirmar', 'iconCadastroConfirmar');

    // ===================================================================
    // VALIDAÇÕES EM TEMPO REAL
    // ===================================================================
    
    const cadastroNome = document.getElementById('cadastroNome');
    const cadastroEmail = document.getElementById('cadastroEmail');
    const cadastroSenha = document.getElementById('cadastroSenha');
    const cadastroConfirmarSenha = document.getElementById('cadastroConfirmarSenha');
    
    if (cadastroNome) {
        cadastroNome.addEventListener('blur', () => {
            const resultado = validacoesCadastro.validarNome(cadastroNome.value);
            if (!resultado.valida) {
                validacoesCadastro.mostrarErrosValidacao('cadastroNome', resultado.erros);
            } else {
                validacoesCadastro.limparErrosValidacao('cadastroNome');
                cadastroNome.value = resultado.nomeFormatado;
            }
        });
        
        cadastroNome.addEventListener('input', () => {
            validacoesCadastro.limparErrosValidacao('cadastroNome');
        });
    }
    
    if (cadastroEmail) {
        cadastroEmail.addEventListener('blur', () => {
            const email = cadastroEmail.value.trim().toLowerCase();
            if (email && !validacoesCadastro.validarEmail(email)) {
                validacoesCadastro.mostrarErrosValidacao('cadastroEmail', ['Formato de e-mail inválido']);
            } else {
                validacoesCadastro.limparErrosValidacao('cadastroEmail');
                cadastroEmail.value = email;
            }
        });
        
        cadastroEmail.addEventListener('input', () => {
            validacoesCadastro.limparErrosValidacao('cadastroEmail');
        });
    }
    
    if (cadastroSenha) {
        cadastroSenha.addEventListener('input', () => {
            const senha = cadastroSenha.value;
            validacoesCadastro.atualizarForcaSenha(senha);
            validacoesCadastro.limparErrosValidacao('cadastroSenha');
            
            if (cadastroConfirmarSenha && cadastroConfirmarSenha.value) {
                validacoesCadastro.limparErrosValidacao('cadastroConfirmarSenha');
            }
        });
        
        cadastroSenha.addEventListener('blur', () => {
            const resultado = validacoesCadastro.validarSenha(cadastroSenha.value);
            if (!resultado.valida) {
                validacoesCadastro.mostrarErrosValidacao('cadastroSenha', resultado.erros);
            }
        });
    }
    
    if (cadastroConfirmarSenha) {
        cadastroConfirmarSenha.addEventListener('input', () => {
            validacoesCadastro.limparErrosValidacao('cadastroConfirmarSenha');
        });
        
        cadastroConfirmarSenha.addEventListener('blur', () => {
            if (cadastroConfirmarSenha.value && cadastroSenha &&
                !validacoesCadastro.validarConfirmacaoSenha(cadastroSenha.value, cadastroConfirmarSenha.value)) {
                validacoesCadastro.mostrarErrosValidacao('cadastroConfirmarSenha', ['As senhas não coincidem']);
            }
        });
    }

    // ===================================================================
    // BOTÃO DE LOGIN - 🔥 CORRIGIDO
    // ===================================================================
    
    const btnLogin = document.getElementById('entrarBtn');
    if (btnLogin) {
        console.log('✅ Botão de login encontrado');
        btnLogin.addEventListener('click', async () => {
            console.log('🔑 Tentando fazer login...');
            
            const email = document.getElementById('loginEmail').value.trim();
            const senha = document.getElementById('loginSenha').value;

            if (!email || !senha) {
                showNotification('Preencha e-mail e senha.', 'error');
                return;
            }

            const originalText = btnLogin.textContent;
            btnLogin.disabled = true;
            btnLogin.textContent = 'Entrando...';

            try {
                console.log('📡 Enviando request para:', `${API_BASE_URL}/auth/login`);
                
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, senha }),
                    credentials: 'include'
                });
                
                console.log('📡 Resposta HTTP:', response.status);
                
                if (!response.ok) {
                    let errorData = { error: `Erro HTTP: ${response.status}` };
                    try {
                        errorData = await response.json();
                    } catch (e) {}
                    throw new Error(errorData.error || `Erro ${response.status}`);
                }

                const data = await response.json();
                console.log('✅ Resposta do servidor:', data);
                
                if (data.role === 'admin') {
                    sessionStorage.setItem('currentAdmin', JSON.stringify(data.user));
                    showNotification('Login de admin realizado!');
                    setTimeout(() => {
                        window.location.href = 'admin.html';
                    }, 500);
                    
                } else if (data.role === 'aluno') {
                    sessionStorage.setItem('currentUser', JSON.stringify(data.user));
                    showNotification('Login realizado com sucesso!');
                    
                    setTimeout(() => {
                        if (data.user.plano === 'premium') {
                            window.location.href = 'premium.html';
                        } else {
                            window.location.href = 'freemium.html';
                        }
                    }, 500);
                } else {
                    throw new Error("Tipo de usuário desconhecido.");
                }

            } catch (error) {
                console.error('❌ Erro ao fazer login:', error);
                showNotification(`Erro ao fazer login: ${error.message}`, 'error');
            } finally {
                btnLogin.disabled = false;
                btnLogin.textContent = originalText;
            }
        });
    } else {
        console.error('❌ Botão de login NÃO encontrado!');
    }

    // ===================================================================
    // BOTÃO DE CRIAR CONTA
    // ===================================================================
    
    const btnCriar = document.getElementById('criarContaBtn');
    if (btnCriar) {
        console.log('✅ Botão de criar conta encontrado');
        btnCriar.addEventListener('click', async () => {
            console.log('📝 Tentando criar conta...');
            
            const nome = cadastroNome.value.trim();
            const email = cadastroEmail.value.trim().toLowerCase();
            const senha = cadastroSenha.value;
            const confirmarSenha = cadastroConfirmarSenha.value;

            let temErro = false;
            
            const resultadoNome = validacoesCadastro.validarNome(nome);
            if (!resultadoNome.valida) {
                validacoesCadastro.mostrarErrosValidacao('cadastroNome', resultadoNome.erros);
                temErro = true;
            } else {
                validacoesCadastro.limparErrosValidacao('cadastroNome');
            }
            
            if (!validacoesCadastro.validarEmail(email)) {
                validacoesCadastro.mostrarErrosValidacao('cadastroEmail', ['Formato de e-mail inválido']);
                temErro = true;
            } else {
                validacoesCadastro.limparErrosValidacao('cadastroEmail');
            }
            
            const resultadoSenha = validacoesCadastro.validarSenha(senha);
            if (!resultadoSenha.valida) {
                validacoesCadastro.mostrarErrosValidacao('cadastroSenha', resultadoSenha.erros);
                temErro = true;
            } else {
                validacoesCadastro.limparErrosValidacao('cadastroSenha');
            }
            
            if (!validacoesCadastro.validarConfirmacaoSenha(senha, confirmarSenha)) {
                validacoesCadastro.mostrarErrosValidacao('cadastroConfirmarSenha', ['As senhas não coincidem']);
                temErro = true;
            } else {
                validacoesCadastro.limparErrosValidacao('cadastroConfirmarSenha');
            }
            
            if (temErro) {
                showNotification('Por favor, corrija os erros antes de continuar.', 'error');
                return;
            }

            try {
                console.log('📡 Enviando request para:', `${API_BASE_URL}/auth/cadastrar_usuario`);
                
                const response = await fetch(`${API_BASE_URL}/auth/cadastrar_usuario`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha }),
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    let errorData = { error: `Erro HTTP: ${response.status}` };
                    try {
                        errorData = await response.json();
                    } catch (e) {}
                    
                    if (errorData.detalhes) {
                        validacoesCadastro.mostrarErrosValidacao('cadastroSenha', errorData.detalhes);
                    }
                    
                    throw new Error(errorData.error || `Erro ${response.status}`);
                }

                const data = await response.json();
                console.log('✅ Conta criada:', data);
                
                showNotification(data.message || 'Conta criada com sucesso!');
                fecharCriarConta();
                
                // Limpar campos
                cadastroNome.value = '';
                cadastroEmail.value = '';
                cadastroSenha.value = '';
                cadastroConfirmarSenha.value = '';
                
                const barra = document.getElementById('barraSenha');
                const texto = document.getElementById('textoSenha');
                if (barra) barra.style.width = '0%';
                if (texto) texto.textContent = '';
                
                validacoesCadastro.limparErrosValidacao('cadastroNome');
                validacoesCadastro.limparErrosValidacao('cadastroEmail');
                validacoesCadastro.limparErrosValidacao('cadastroSenha');
                validacoesCadastro.limparErrosValidacao('cadastroConfirmarSenha');
                
                abrirLogin();

            } catch (error) {
                console.error('❌ Erro ao criar conta:', error);
                showNotification(`Erro ao criar conta: ${error.message}`, 'error');
            }
        });
    } else {
        console.error('❌ Botão de criar conta NÃO encontrado!');
    }
    
    console.log('✅ Inicialização completa!');
});
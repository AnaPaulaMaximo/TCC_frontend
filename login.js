// ===================================================================
// VALIDAÇÕES DO FORMULÁRIO DE CADASTRO
// ===================================================================

/**
 * Valida formato de e-mail usando regex padrão
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Lista de senhas comuns que devem ser bloqueadas
 */
const senhasComuns = [
    '123456', '123456789', 'qwerty', 'password', '12345678',
    '111111', '123123', '1234567890', '1234567', 'senha',
    'senha123', 'admin', 'admin123', 'root', '12345',
    'password123', 'abc123', '1q2w3e4r', 'qwerty123', 'letmein'
];

/**
 * Valida complexidade da senha
 * Retorna objeto com: { valida: boolean, erros: string[] }
 */
function validarSenha(senha) {
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
    
    if (senhasComuns.includes(senha.toLowerCase())) {
        erros.push('Esta senha é muito comum. Escolha uma senha mais segura');
    }
    
    if (/(.)\1{2,}/.test(senha)) {
        erros.push('Evite repetir o mesmo caractere mais de 2 vezes seguidas');
    }
    
    return {
        valida: erros.length === 0,
        erros: erros
    };
}

/**
 * Valida se as senhas coincidem
 */
function validarConfirmacaoSenha(senha, confirmacao) {
    return senha === confirmacao;
}

/**
 * Valida nome 
 */
function validarNome(nome) {
    const erros = [];
    
    nome = nome.trim();
    
    if (nome.length < 3) {
        erros.push('O nome deve ter no mínimo 3 caracteres');
    }
    
    if (nome.length > 30) {
        erros.push('O nome deve ter no máximo 30 caracteres');
    }
    
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nome)) {
        erros.push('O nome deve conter apenas letras');
    }
    
    return {
        valida: erros.length === 0,
        erros: erros,
        nomeFormatado: nome
    };
}

/**
 * Mostra indicador visual de força da senha
 */
function atualizarForcaSenha(senha) {
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
}

/**
 * Mostra erros de validação na tela - VERSÃO CORRIGIDA
 */
function mostrarErrosValidacao(campo, erros) {
    const input = document.getElementById(campo);
    if (!input) return;
    
    // Encontra o container pai (div com class w-full mb-X)
    let container = input.closest('.w-full');
    if (!container) {
        container = input.parentElement;
    }
    
    // Remove erros anteriores deste campo
    const erroAnterior = container.querySelector('.erro-validacao');
    if (erroAnterior) {
        erroAnterior.remove();
    }
    
    if (erros.length > 0) {
        // Adiciona borda vermelha
        input.classList.add('border-red-500', 'border-2');
        
        // Cria elemento de erro
        const divErro = document.createElement('div');
        divErro.className = 'erro-validacao text-red-600 text-xs mt-2 px-1';
        divErro.innerHTML = erros.map(e => `• ${e}`).join('<br>');
        
        // Adiciona o erro dentro do container, logo após o input ou seu wrapper
        const inputWrapper = input.parentElement;
        if (inputWrapper.classList.contains('relative')) {
            // Se o input está dentro de um div relative (caso da senha), adiciona após o div
            inputWrapper.parentElement.insertBefore(divErro, inputWrapper.nextSibling);
        } else {
            // Caso contrário, adiciona após o input
            input.parentElement.insertBefore(divErro, input.nextSibling);
        }
    } else {
        input.classList.remove('border-red-500', 'border-2');
    }
}

/**
 * Limpa erros de validação - VERSÃO CORRIGIDA
 */
function limparErrosValidacao(campo) {
    const input = document.getElementById(campo);
    if (!input) return;
    
    input.classList.remove('border-red-500', 'border-2');
    
    // Encontra o container pai
    let container = input.closest('.w-full');
    if (!container) {
        container = input.parentElement;
    }
    
    // Remove todos os erros deste container
    const erros = container.querySelectorAll('.erro-validacao');
    erros.forEach(erro => erro.remove());
}

// ===================================================================
// INTEGRAÇÃO COM O FORMULÁRIO
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    const cadastroNome = document.getElementById('cadastroNome');
    const cadastroEmail = document.getElementById('cadastroEmail');
    const cadastroSenha = document.getElementById('cadastroSenha');
    const cadastroConfirmarSenha = document.getElementById('cadastroConfirmarSenha');
    
    // Adicionar indicador de força da senha ao HTML
    if (cadastroSenha && !document.getElementById('forcaSenhaContainer')) {
        const senhaContainer = cadastroSenha.closest('.w-full');
        const indicador = document.createElement('div');
        indicador.id = 'forcaSenhaContainer';
        indicador.className = 'mt-2';
        indicador.innerHTML = `
            <div class="flex justify-between items-center mb-1">
                <span class="text-xs text-gray-600">Força da senha:</span>
                <span id="textoSenha" class="text-xs font-medium"></span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div id="barraSenha" class="h-full rounded transition-all duration-300" style="width: 0%"></div>
            </div>
        `;
        senhaContainer.appendChild(indicador);
    }
    
    // Validação em tempo real do nome
    if (cadastroNome) {
        cadastroNome.addEventListener('blur', () => {
            const resultado = validarNome(cadastroNome.value);
            if (!resultado.valida) {
                mostrarErrosValidacao('cadastroNome', resultado.erros);
            } else {
                limparErrosValidacao('cadastroNome');
                cadastroNome.value = resultado.nomeFormatado;
            }
        });
        
        cadastroNome.addEventListener('input', () => {
            limparErrosValidacao('cadastroNome');
        });
    }
    
    // Validação em tempo real do e-mail
    if (cadastroEmail) {
        cadastroEmail.addEventListener('blur', () => {
            const email = cadastroEmail.value.trim().toLowerCase();
            if (email && !validarEmail(email)) {
                mostrarErrosValidacao('cadastroEmail', ['Formato de e-mail inválido']);
            } else {
                limparErrosValidacao('cadastroEmail');
                cadastroEmail.value = email;
            }
        });
        
        cadastroEmail.addEventListener('input', () => {
            limparErrosValidacao('cadastroEmail');
        });
    }
    
    // Indicador de força da senha em tempo real
    if (cadastroSenha) {
        cadastroSenha.addEventListener('input', () => {
            const senha = cadastroSenha.value;
            atualizarForcaSenha(senha);
            limparErrosValidacao('cadastroSenha');
            
            if (cadastroConfirmarSenha.value) {
                limparErrosValidacao('cadastroConfirmarSenha');
            }
        });
        
        cadastroSenha.addEventListener('blur', () => {
            const resultado = validarSenha(cadastroSenha.value);
            if (!resultado.valida) {
                mostrarErrosValidacao('cadastroSenha', resultado.erros);
            }
        });
    }
    
    // Validação da confirmação de senha
    if (cadastroConfirmarSenha) {
        cadastroConfirmarSenha.addEventListener('input', () => {
            limparErrosValidacao('cadastroConfirmarSenha');
        });
        
        cadastroConfirmarSenha.addEventListener('blur', () => {
            if (cadastroConfirmarSenha.value && 
                !validarConfirmacaoSenha(cadastroSenha.value, cadastroConfirmarSenha.value)) {
                mostrarErrosValidacao('cadastroConfirmarSenha', ['As senhas não coincidem']);
            }
        });
    }

    // Botão de Criar Conta
    document.getElementById('criarContaBtn').addEventListener('click', async () => {
        const nome = document.getElementById('cadastroNome').value.trim();
        const email = document.getElementById('cadastroEmail').value.trim().toLowerCase();
        const senha = document.getElementById('cadastroSenha').value;
        const confirmarSenha = document.getElementById('cadastroConfirmarSenha').value;

        let temErro = false;
        
        const resultadoNome = validarNome(nome);
        if (!resultadoNome.valida) {
            mostrarErrosValidacao('cadastroNome', resultadoNome.erros);
            temErro = true;
        } else {
            limparErrosValidacao('cadastroNome');
        }
        
        if (!validarEmail(email)) {
            mostrarErrosValidacao('cadastroEmail', ['Formato de e-mail inválido']);
            temErro = true;
        } else {
            limparErrosValidacao('cadastroEmail');
        }
        
        const resultadoSenha = validarSenha(senha);
        if (!resultadoSenha.valida) {
            mostrarErrosValidacao('cadastroSenha', resultadoSenha.erros);
            temErro = true;
        } else {
            limparErrosValidacao('cadastroSenha');
        }
        
        if (!validarConfirmacaoSenha(senha, confirmarSenha)) {
            mostrarErrosValidacao('cadastroConfirmarSenha', ['As senhas não coincidem']);
            temErro = true;
        } else {
            limparErrosValidacao('cadastroConfirmarSenha');
        }
        
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
                } catch (e) { /* Ignora */ }
                
                if (errorData.detalhes) {
                    mostrarErrosValidacao('cadastroSenha', errorData.detalhes);
                }
                
                throw new Error(errorData.error || `Erro ${response.status}`);
            }

            const data = await response.json();
            
            showNotification(data.message || 'Conta criada com sucesso!');
            fecharCriarConta();
            
            document.getElementById('cadastroNome').value = '';
            document.getElementById('cadastroEmail').value = '';
            document.getElementById('cadastroSenha').value = '';
            document.getElementById('cadastroConfirmarSenha').value = '';
            
            const barra = document.getElementById('barraSenha');
            const texto = document.getElementById('textoSenha');
            if (barra) barra.style.width = '0%';
            if (texto) texto.textContent = '';
            
            limparErrosValidacao('cadastroNome');
            limparErrosValidacao('cadastroEmail');
            limparErrosValidacao('cadastroSenha');
            limparErrosValidacao('cadastroConfirmarSenha');
            
            abrirLogin();

        } catch (error) {
            console.error('Erro ao conectar com a API de cadastro:', error);
            showNotification(`Erro ao criar conta: ${error.message}.`, 'error');
        }
    });
});
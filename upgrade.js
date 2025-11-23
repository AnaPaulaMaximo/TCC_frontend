/**
 * Exibe uma notificação na tela
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
            <span class="material-icons ${iconColor}" style="font-size: 24px;">${iconName}</span>
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

/**
 * Mostra o modal de boas-vindas Premium
 */
function showWelcomePremiumModal() {
    // Cria o modal
    const modal = document.createElement('div');
    modal.id = 'welcomePremiumModal';
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4';
    modal.style.animation = 'fadeIn 0.3s ease-out';
    
    modal.innerHTML = `
        <div class="bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-8 max-w-2xl w-full shadow-2xl transform" style="animation: modalSlideIn 0.4s ease-out;">
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                    <span class="material-icons text-white text-5xl">workspace_premium</span>
                </div>
                <h2 class="text-4xl font-extrabold text-white mb-2">🎉 Bem-vindo ao Premium!</h2>
                <p class="text-white/90 text-lg">Sua jornada de estudos acaba de evoluir</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <h3 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span class="material-icons">auto_awesome</span>
                    Novas Funcionalidades Desbloqueadas:
                </h3>
                
                <div class="grid gap-4">
                    <div class="flex items-start gap-3 text-white">
                        <span class="material-icons text-yellow-300 flex-shrink-0">quiz</span>
                        <div>
                            <p class="font-semibold">Quiz Personalizado com IA</p>
                            <p class="text-sm text-white/80">Gere quizzes sobre qualquer tema de Filosofia ou Sociologia</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-3 text-white">
                        <span class="material-icons text-yellow-300 flex-shrink-0">style</span>
                        <div>
                            <p class="font-semibold">Flashcards Ilimitados</p>
                            <p class="text-sm text-white/80">Crie flashcards personalizados sobre qualquer assunto</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-3 text-white">
                        <span class="material-icons text-yellow-300 flex-shrink-0">article</span>
                        <div>
                            <p class="font-semibold">Resumos Inteligentes</p>
                            <p class="text-sm text-white/80">Solicite resumos detalhados de qualquer tema</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-3 text-white">
                        <span class="material-icons text-yellow-300 flex-shrink-0">edit_document</span>
                        <div>
                            <p class="font-semibold">Correção de Redações</p>
                            <p class="text-sm text-white/80">Receba feedback detalhado da IA sobre seus textos</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-3 text-white">
                        <span class="material-icons text-yellow-300 flex-shrink-0">chat</span>
                        <div>
                            <p class="font-semibold">Chatbot Tutor</p>
                            <p class="text-sm text-white/80">Converse em tempo real com um assistente especializado</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start gap-3 text-white">
                        <span class="material-icons text-yellow-300 flex-shrink-0">history</span>
                        <div>
                            <p class="font-semibold">Histórico Completo</p>
                            <p class="text-sm text-white/80">Acesse todo seu conteúdo gerado e resultados salvos</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <button id="closeWelcomeModal" class="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                    <span class="flex items-center gap-2 justify-center">
                        <span class="material-icons">rocket_launch</span>
                        Começar a Explorar
                    </span>
                </button>
                <p class="text-white/70 text-sm mt-4">Você será redirecionado para o painel Premium</p>
            </div>
        </div>
    `;
    
    // Adiciona animações CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes modalSlideIn {
            from { 
                opacity: 0; 
                transform: translateY(-30px) scale(0.9);
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1);
            }
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Evento do botão de fechar
    document.getElementById('closeWelcomeModal').addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            modal.remove();
            // Redireciona para a página premium
            window.location.href = 'premium.html';
        }, 300);
    });
}

/**
 * Processa o upgrade do usuário
 */
async function processarUpgrade() {
    const API_BASE_URL = 'http://127.0.0.1:5000';
    
    // Mostra loading no botão
    const submitBtn = document.querySelector('#paymentForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="material-icons animate-spin">hourglass_empty</span> Processando...';
    
    try {
        // Pega o usuário da sessão
        const storedUser = sessionStorage.getItem('currentUser');
        
        if (!storedUser) {
            showNotification("Você precisa estar logado para fazer o upgrade.", 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
        
        const userData = JSON.parse(storedUser);
        const id_aluno = userData.id_aluno;
        
        // Verifica se já é premium
        if (userData.plano === 'premium') {
            showNotification("Você já é um usuário Premium!", 'error');
            setTimeout(() => {
                window.location.href = 'premium.html';
            }, 2000);
            return;
        }
        
        // CORREÇÃO: Envia TODOS os campos necessários, incluindo plano
        const updateData = {
            nome: userData.nome,
            email: userData.email,
            url_foto: userData.url_foto || '',
            plano: 'premium'  // Campo principal para atualização
        };
        
        console.log('Enviando upgrade para:', `${API_BASE_URL}/auth/editar_usuario/${id_aluno}`);
        console.log('Dados enviados:', updateData);
        
        const response = await fetch(`${API_BASE_URL}/auth/editar_usuario/${id_aluno}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(updateData),
            credentials: 'include'
        });
        
        console.log('Status da resposta:', response.status);
        
        // Tenta pegar o JSON da resposta
        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error('Erro ao parsear JSON:', e);
            throw new Error('Resposta inválida do servidor');
        }
        
        console.log('Resposta do servidor:', data);
        
        if (!response.ok) {
            throw new Error(data.error || `Erro HTTP ${response.status}`);
        }
        
        // Atualiza o sessionStorage
        userData.plano = 'premium';
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
        
        console.log('✅ Plano atualizado no sessionStorage');
        
        // Verifica se é a primeira vez que vira Premium
        const hasSeenWelcome = localStorage.getItem('hasSeenPremiumWelcome');
        
        if (!hasSeenWelcome) {
            // Marca que já viu a mensagem
            localStorage.setItem('hasSeenPremiumWelcome', 'true');
            console.log('🎉 Primeira vez Premium - mostrando modal');
            
            // Mostra o modal de boas-vindas
            showWelcomePremiumModal();
        } else {
            // Não é a primeira vez, apenas redireciona
            console.log('✨ Upgrade repetido - redirecionando direto');
            showNotification('Upgrade realizado com sucesso!');
            setTimeout(() => {
                window.location.href = 'premium.html';
            }, 1500);
        }
        
    } catch (error) {
        console.error('❌ Erro ao fazer upgrade:', error);
        showNotification(`Erro ao processar o upgrade: ${error.message}`, 'error');
        
        // Restaura o botão
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Lógica original do cartão (mantida intacta)
document.addEventListener('DOMContentLoaded', () => {
    const cardNumberInput = document.getElementById('cardNumber');
    const cardNameInput = document.getElementById('cardName');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCVCInput = document.getElementById('cardCVC');
    const cardDisplay = document.querySelector('.card-display');

    const displayCardNumber = document.getElementById('display-number');
    const displayCardName = document.getElementById('display-name');
    const displayCardExpiry = document.getElementById('display-expiry');
    const displayCardCVC = document.getElementById('display-cvc');
    const paymentForm = document.getElementById('paymentForm');

    // Funções de formatação do cartão (mantidas iguais)
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.match(/.{1,4}/g)?.join(' ') || '';
        e.target.value = value;
        displayCardNumber.textContent = value.padEnd(19, 'X').replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || 'XXXX XXXX XXXX XXXX';
    });

    cardNameInput.addEventListener('input', (e) => {
        let value = e.target.value.toUpperCase();
        displayCardName.textContent = value || 'NOME DO TITULAR';
    });

    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
        displayCardExpiry.textContent = value || 'MM/AA';
    });

    cardCVCInput.addEventListener('focus', () => {
        cardDisplay.classList.add('flipped');
    });

    cardCVCInput.addEventListener('blur', () => {
        cardDisplay.classList.remove('flipped');
    });

    cardCVCInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
        displayCardCVC.textContent = value || '***';
    });

    // MODIFICAÇÃO: Agora processa o upgrade sem validar campos
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Remove validação dos campos - permite enviar sem preencher
        processarUpgrade();
    });

    // Lógica de seleção de plano (mantida igual)
    const radioMensal = document.getElementById('plan-mensal');
    const radioAnual = document.getElementById('plan-anual');
    
    const summaryPlanName = document.getElementById('summary-plan-name');
    const summaryPlanPrice = document.getElementById('summary-plan-price');
    const summaryTotalPrice = document.getElementById('summary-total-price');
    const submitButtonText = document.getElementById('submit-button-text');

    const planos = {
        mensal: {
            nome: 'Plano Mensal Premium',
            preco: 'R$ 34,90',
            total: 'R$ 34,90',
            botao: 'Pagar R$ 34,90'
        },
        anual: {
            nome: 'Plano Anual Premium',
            preco: 'R$ 334.90',
            total: 'R$ 334.90',
            botao: 'Pagar R$ 334.90'
        }
    };

    function updatePaymentDetails() {
        const planoSelecionado = radioMensal.checked ? planos.mensal : planos.anual;
        summaryPlanName.textContent = planoSelecionado.nome;
        summaryPlanPrice.textContent = planoSelecionado.preco;
        summaryTotalPrice.textContent = planoSelecionado.total;
        submitButtonText.textContent = planoSelecionado.botao;
    }

    radioMensal.addEventListener('change', updatePaymentDetails);
    radioAnual.addEventListener('change', updatePaymentDetails);
    updatePaymentDetails();
});
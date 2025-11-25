/**
 * Correções específicas para Mobile
 * Adicione este script em TODAS as páginas (admin.html, freemium.html, premium.html)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ====================================
    // 1. FECHAR SIDEBAR AO CLICAR FORA
    // ====================================
    function setupSidebarClickOutside() {
        const sidebar = document.getElementById('sidebar');
        const openBtn = document.getElementById('openSidebarBtn');
        const mainContent = document.getElementById('mainContent');
        const topbar = document.getElementById('topbar');
        
        if (!sidebar) return;
        
        
        
        // Função para fechar sidebar
        function closeSidebar() {
            sidebar.classList.remove('sidebar-visible');
            sidebar.classList.add('sidebar-hidden');
            
            if (topbar) topbar.style.paddingLeft = '0rem';
            if (mainContent) mainContent.classList.remove('ml-64');
            if (openBtn) {
                setTimeout(() => {
                    openBtn.classList.remove('hidden');
                }, 400);
            }
        }
        
        // Detecta cliques fora da sidebar quando ela está aberta
        document.addEventListener('click', (e) => {
            // Verifica se é mobile
            if (window.innerWidth > 768) return;
            
            // Verifica se a sidebar está visível
            if (!sidebar.classList.contains('sidebar-visible')) return;
            
            // Verifica se o clique foi dentro da sidebar ou no botão de abrir
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnOpenBtn = openBtn && openBtn.contains(e.target);
            
            // Se clicou fora, fecha a sidebar
            if (!isClickInsideSidebar && !isClickOnOpenBtn) {
                closeSidebar();
            }
        });
        
        
    }
    
    // ====================================
    // 2. AJUSTAR ALTURA DOS MODAIS
    // ====================================
    function adjustModalHeights() {
        const modals = [
            'modalEditarPerfil',
            'modalAluno',
            'modalHistorico',
            'modalLogin',
            'modalCriarConta'
        ];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            // Observer para quando o modal for aberto
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const isVisible = !modal.classList.contains('hidden');
                        
                        if (isVisible && window.innerWidth <= 768) {
                            // Ajusta a altura do conteúdo do modal
                            const modalContent = modal.querySelector('.modal-anim, .bg-white, div[class*="rounded"]');
                            if (modalContent) {
                                // Garante scroll interno se necessário
                                modalContent.style.maxHeight = '85vh';
                                modalContent.style.overflowY = 'auto';
                                modalContent.style.display = 'flex';
                                modalContent.style.flexDirection = 'column';
                                
                                // Garante que botões fiquem visíveis
                                const buttons = modalContent.querySelectorAll('button');
                                buttons.forEach(btn => {
                                    btn.style.flexShrink = '0';
                                    btn.style.marginTop = '1rem';
                                });
                            }
                        }
                    }
                });
            });
            
            observer.observe(modal, { attributes: true });
        });
    }
    
    // ====================================
    // 3. REDIMENSIONAR AO ROTACIONAR TELA
    // ====================================
    function handleOrientationChange() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const topbar = document.getElementById('topbar');
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Fecha sidebar se mudou para landscape e estava aberta
                if (window.innerWidth > 768 && sidebar?.classList.contains('sidebar-visible')) {
                    sidebar.classList.remove('sidebar-visible');
                    sidebar.classList.add('sidebar-hidden');
                    if (topbar) topbar.style.paddingLeft = '0rem';
                    if (mainContent) mainContent.classList.remove('ml-64');
                }
            }, 100);
        });
    }
    
    // ====================================
    // 4. PREVENIR ZOOM AO FOCAR INPUTS (iOS)
    // ====================================
    function preventInputZoom() {
        if (window.innerWidth <= 768) {
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                const currentFontSize = window.getComputedStyle(input).fontSize;
                const fontSize = parseFloat(currentFontSize);
                
                // iOS zomba se font-size < 16px
                if (fontSize < 16) {
                    input.style.fontSize = '16px';
                }
            });
        }
    }
    
    // ====================================
    // 5. MELHORAR SCROLL DO MENU SUPERIOR
    // ====================================
    function improveTopbarMenu() {
        const menuBar = document.getElementById('menuBar');
        if (!menuBar || window.innerWidth > 768) return;
        
        // Adiciona indicadores de scroll
        menuBar.style.position = 'relative';
        
        // Adiciona gradientes nas bordas para indicar mais conteúdo
        const leftGradient = document.createElement('div');
        leftGradient.className = 'menu-scroll-indicator-left';
        leftGradient.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 20px;
            background: linear-gradient(to right, rgba(91, 33, 182, 1), transparent);
            pointer-events: none;
            z-index: 1;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        
        const rightGradient = document.createElement('div');
        rightGradient.className = 'menu-scroll-indicator-right';
        rightGradient.style.cssText = `
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 20px;
            background: linear-gradient(to left, rgba(167, 139, 250, 1), transparent);
            pointer-events: none;
            z-index: 1;
            opacity: 1;
            transition: opacity 0.3s;
        `;
        
        menuBar.parentElement?.appendChild(leftGradient);
        menuBar.parentElement?.appendChild(rightGradient);
        
        // Atualiza indicadores ao scrollar
        menuBar.addEventListener('scroll', () => {
            const scrollLeft = menuBar.scrollLeft;
            const maxScroll = menuBar.scrollWidth - menuBar.clientWidth;
            
            leftGradient.style.opacity = scrollLeft > 10 ? '1' : '0';
            rightGradient.style.opacity = scrollLeft < maxScroll - 10 ? '1' : '0';
        });
    }
    
    // ====================================
    // INICIALIZAÇÃO
    // ====================================
    setupSidebarClickOutside();
    adjustModalHeights();
    handleOrientationChange();
    preventInputZoom();
    improveTopbarMenu();
    
    // Reaplica correções ao redimensionar
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            preventInputZoom();
            improveTopbarMenu();
        }, 250);
    });
    

});
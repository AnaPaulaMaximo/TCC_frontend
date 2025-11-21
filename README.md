
-----

# Repensei - Frontend (TCC)

Este repositório contém a interface web (Frontend) da aplicação **Repensei**, uma plataforma de ensino de Filosofia e Sociologia. O projeto foca em uma experiência de usuário moderna, responsiva e interativa, conectando-se a uma API Backend para fornecer recursos de Inteligência Artificial.

## 🎨 Design & UX

O design do projeto adota o estilo **Glassmorphism** (efeito de vidro fosco), utilizando gradientes suaves (tons de roxo, rosa e azul) e elementos translúcidos para criar uma interface moderna e imersiva.

**Destaques Visuais:**

  * **Glassmorphism:** Paineis e modais com `backdrop-filter: blur`.
  * **Responsividade:** Layout adaptável para Mobile e Desktop via **Tailwind CSS**.
  * **Micro-interações:** Animações de *fade-in*, transições suaves em botões e *toasts* de notificação.
  * **Visualização de Dados:** Gráficos interativos no painel administrativo.

## 📋 Funcionalidades da Interface

A aplicação Frontend gerencia diferentes experiências baseadas no perfil do usuário:

### 🏠 Pública

  * **Landing Page:** Apresentação da plataforma.
  * **Autenticação:** Modais de Login e Cadastro animados.
  * **Upgrade:** Página de simulação de pagamento com **animação 3D de cartão de crédito** (Flip Card).

### 🆓 Aluno Freemium

  * Acesso restrito a conteúdos de curadoria.
  * Interface para seleção de Quizzes e Flashcards estáticos.
  * Incentivos visuais para upgrade (botões e banners).

### 💎 Aluno Premium

  * **Dashboard Completo:** Acesso a todas as ferramentas de IA.
  * **Chatbot Real-time:** Interface de chat conectada via Socket.IO com indicador de "digitando".
  * **Histórico Interativo:** Visualização detalhada de atividades passadas (clique para expandir).
  * **Geradores Dinâmicos:** Formulários para solicitar Resumos, Correções e Flashcards à IA.

### ⚙️ Administrador

  * **Dashboard Analítico:** Cards de métricas e gráficos (Pizza e Barras) via Chart.js.
  * **Gestão de Alunos:** Tabela com ações de CRUD (Criar, Editar, Excluir) e visualização de performance individual.

-----

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando **Vanilla JavaScript** (JS Puro) e bibliotecas via CDN para manter a leveza e simplicidade.

  * **Estrutura:** HTML5 Semântico.
  * **Estilização:**
      * [Tailwind CSS](https://tailwindcss.com/) (via CDN) - Framework utilitário.
      * `style.css` - Customizações para animações, scrollbars e efeitos Glass.
      * [Google Material Icons](https://fonts.google.com/icons) - Iconografia.
  * **JavaScript & Bibliotecas:**
      * **ES6+ Modules:** Lógica separada por responsabilidade (`login.js`, `premium.js`, etc.).
      * [Socket.IO Client](https://socket.io/): Para comunicação em tempo real no Chatbot.
      * [Chart.js](https://www.chartjs.org/): Para renderização dos gráficos no painel Admin.

-----

## 📂 Estrutura de Arquivos

```text
TCC_Frontend/
├── index.html          # Landing page
├── login.html          # (Redirecionamento/Estrutura base de login)
├── login.js            # Lógica de autenticação
├── freemium.html       # Dashboard do plano Gratuito
├── freemium.js         # Lógica do plano Gratuito
├── premium.html        # Dashboard do plano Pago (IA e Chat)
├── premium.js          # Lógica complexa (Socket.IO, Histórico, IA)
├── admin.html          # Painel Administrativo
├── admin.js            # Lógica do Admin (Gráficos, CRUD)
├── upgrade.html        # Página de Pagamento
├── upgrade.js          # Lógica da animação do cartão de crédito
├── script.js           # Scripts globais e utilitários compartilhados
└── static/
    ├── style.css       # Estilos globais, animações e overrides
    └── img/
        ├── logo.png    # Logotipo do projeto
        └── favicon.png # Ícone do navegador
```

-----

## 🚀 Como Executar

Como o frontend é composto por arquivos estáticos (HTML/JS/CSS), você precisa de um servidor HTTP simples para evitar erros de **CORS** (Cross-Origin Resource Sharing) ao conectar com o backend e carregar módulos.

### Pré-requisitos

  * Navegador moderno (Chrome, Edge, Firefox).
  * Conexão com a internet (para carregar Tailwind, Fonts e Ícones via CDN).
  * **Backend rodando:** Certifique-se de que o servidor Flask esteja rodando em `http://127.0.0.1:5000`.

### Passo a Passo

1.  **Clone o repositório:**

    ```bash
    git clone <url-do-repositorio>
    cd TCC_Frontend
    ```

2.  **Opção A: Usando Python (Recomendado)**
    Se você já tem o Python instalado, execute na raiz da pasta:

    ```bash
    python -m http.server 8000
    ```

    Acesse: `http://localhost:8000`

3.  **Opção B: Usando VS Code**

      * Instale a extensão **Live Server**.
      * Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

-----

## ⚙️ Configuração

### Conexão com a API

Os arquivos JavaScript (`script.js`, `premium.js`, etc.) possuem uma constante que define o endereço do backend. Caso seu backend mude de porta ou endereço, atualize a seguinte linha nos arquivos JS:

```javascript
const API_BASE_URL = 'http://127.0.0.1:5000'; // Ajuste conforme necessário
const SOCKET_URL = 'http://127.0.0.1:5000';   // Para o Chatbot
```

-----

## 📸 Funcionalidades em Destaque

### Animação de Cartão 3D (`upgrade.js`)

Na tela de Upgrade, ao preencher o CVV, o cartão virtual gira 180 graus para mostrar o verso, utilizando `perspective` e `transform: rotateY` do CSS.

### Sistema de Notificações (`showNotification`)

Um sistema de "Toasts" personalizado (sem bibliotecas externas) foi implementado para feedbacks de erro e sucesso, aparecendo no canto superior direito com animações de entrada e saída.

### Chatbot com Socket.IO

O chat não utiliza requisições HTTP comuns (polling), mas sim **WebSockets**, garantindo que a resposta da IA apareça letra por letra ou instantaneamente sem recarregar a página.

-----

### Autor

Adicionar dps
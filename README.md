# 🧠 Repensei - Frontend (TCC)

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node Version](https://img.shields.io/badge/javascript-ES6%2B-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

Uma plataforma moderna e inteligente para ensino de **Filosofia e Sociologia**, com suporte a Inteligência Artificial, chat em tempo real e um painel administrativo robusto.

## 📌 Links Importantes

- **Frontend:** [TCC_frontend](https://github.com/seu-usuario/TCC_frontend)
- **Backend (API):** [Insira o link do repositório backend aqui]
- **Deploy (Frontend):** [Insira o link do deploy aqui]
- **Deploy (Backend):** [Insira o link do deploy aqui]

---

## 🎨 Design & UX

O projeto adota o estilo **Glassmorphism** com uma paleta visual moderna e responsiva:

### Características Visuais
- ✨ **Glassmorphism:** Painels translúcidos com efeito `backdrop-filter: blur`
- 📱 **Responsividade:** Adaptável para Mobile, Tablet e Desktop via **Tailwind CSS**
- 🎬 **Micro-interações:** Animações fluidas (fade-in, transições, toasts)
- 📊 **Visualização de Dados:** Gráficos interativos com Chart.js
- 🎯 **Tema:** Gradientes suaves em roxo, rosa e azul

---

## 📋 Funcionalidades por Perfil

### 🌍 Área Pública
- **Landing Page:** Apresentação da plataforma Repensei
- **Autenticação:** Modais animados de Login e Cadastro
- **Página Upgrade:** Simulação de pagamento com animação 3D de cartão de crédito (Flip Card)

### 🆓 Aluno Freemium
- Acesso limitado a conteúdos curados
- Seleção de Quizzes e Flashcards estáticos
- Incentivos visuais para upgrade (banners e botões)
- Interface clara e intuitiva para exploração

### 💎 Aluno Premium
- **Dashboard Completo:** Acesso a todas as ferramentas de IA
- **Chatbot Real-time:** Chat conectado via Socket.IO com indicador de digitação
- **Histórico Interativo:** Visualização expandível de atividades anteriores
- **Geradores Dinâmicos:** Solicitar Resumos, Correções e Flashcards à IA
- **Estatísticas Pessoais:** Acompanhamento de progresso

### ⚙️ Administrador
- **Dashboard Analítico:** Cards de métricas e gráficos (Pizza e Barras)
- **Gestão de Alunos:** Tabela CRUD com ações (Criar, Editar, Excluir)
- **Visualização de Performance:** Dados detalhados por aluno
- **Relatórios:** Exportação de dados e estatísticas

---

## 🛠️ Stack Tecnológico

### Estrutura & Estilização
| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| HTML5 | - | Estrutura semântica |
| CSS3 | - | Estilos customizados e animações |
| Tailwind CSS | 3.x | Framework CSS utilitário (CDN) |
| Google Material Icons | Latest | Iconografia |

### JavaScript & Bibliotecas
| Bibliotecas | Versão | Uso |
|-----------|--------|-----|
| JavaScript | ES6+ | Lógica da aplicação (módulos) |
| Socket.IO Client | 4.x | Chat real-time (WebSockets) |
| Chart.js | 3.x | Gráficos interativos |

---

## 📂 Estrutura de Diretórios

```
TCC_frontend/
├── 📄 index.html               # Landing page principal
├── 📄 login.html               # Estrutura base de autenticação
├── 📄 freemium.html            # Dashboard do plano Gratuito
├── 📄 premium.html             # Dashboard do plano Pago
├── 📄 admin.html               # Painel Administrativo
├── 📄 upgrade.html             # Página de Pagamento
│
├── 🔧 login.js                 # Lógica de autenticação
├── 🔧 freemium.js              # Funcionalidades do plano Freemium
├── 🔧 premium.js               # Lógica avançada (Socket.IO, histórico)
├── 🔧 admin.js                 # Dashboard Admin (gráficos, CRUD)
├── 🔧 upgrade.js               # Animação do cartão de crédito
├── 🔧 script.js                # Utilitários e funções globais
│
├── 📁 static/
│   ├── 🎨 style.css            # Estilos globais, animações, glassmorphism
│   └── 🖼️ img/
│       ├── logo.png            # Logo da plataforma
│       └── favicon.png         # Ícone do navegador
│
├── 📋 README.md                # Este arquivo
└── 📋 .gitignore               # Arquivos ignorados pelo Git
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- ✅ Navegador moderno (Chrome, Edge, Firefox, Safari)
- ✅ Conexão com a internet (CDNs de Tailwind, Fonts, Ícones)
- ✅ Python 3.x instalado (recomendado para servidor HTTP)
- ✅ Backend rodando em `http://127.0.0.1:5000`

### Passo a Passo

#### 1️⃣ Clone o repositório
```bash
git clone [LINK_DO_REPOSITORIO_BACKEND]
cd TCC_frontend
```

#### 2️⃣ Inicie um servidor HTTP

**Opção A: Python (Recomendado)**
```bash
python -m http.server 8000
```
Acesse: `http://localhost:8000`

**Opção B: Node.js (http-server)**
```bash
npm install -g http-server
http-server -p 8000
```
Acesse: `http://localhost:8000`

**Opção C: VS Code Live Server**
1. Instale a extensão **"Live Server"** (Five Server)
2. Clique com botão direito em `index.html`
3. Selecione **"Open with Live Server"**

---

## ⚙️ Configuração

### Variáveis de Ambiente

Os arquivos JavaScript utilizam constantes para conectar ao backend. Atualize conforme necessário:

#### Em `script.js`
```javascript
// Endereço da API Backend
const API_BASE_URL = 'http://127.0.0.1:5000';

// Para comunicação WebSocket (Chatbot)
const SOCKET_URL = 'http://127.0.0.1:5000';
```

#### Em `premium.js` (Socket.IO)
```javascript
const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});
```

### Mudança de URL do Backend
Se seu backend estiver em outro endereço (ex: produção), atualize:
```javascript
const API_BASE_URL = 'https://api.repensei.com'; // Seu endereço de produção
const SOCKET_URL = 'https://api.repensei.com';
```

---

## 🎯 Funcionalidades em Destaque

### 🎴 Animação 3D do Cartão de Crédito
Localização: `upgrade.js` e `style.css`

O cartão gira 180° ao preencher o CVV usando CSS 3D:
```javascript
// Exemplo de lógica em upgrade.js
cardElement.style.transform = 'rotateY(180deg)';
```

### 🔔 Sistema de Notificações (Toast)
Função global sem dependências externas:
```javascript
showNotification('Sucesso!', 'success'); // Verde
showNotification('Erro!', 'error');      // Vermelho
```

### 💬 Chatbot Real-time com Socket.IO
- Conexão WebSocket persistente
- Indicador de "digitando" em tempo real
- Histórico sincronizado
- Resposta letra por letra ou instantânea

### 📊 Gráficos Interativos (Chart.js)
Dashboard Admin com:
- Gráfico de Pizza (distribuição de alunos)
- Gráfico de Barras (atividades por mês)
- Cards de métricas (total de alunos, quizzes, etc.)

---

## 📱 Responsividade

O projeto utiliza **Tailwind CSS** com breakpoints padrão:

| Breakpoint | Dispositivo | Resolução |
|-----------|-----------|-----------|
| sm | Celular Pequeno | 640px |
| md | Tablet | 768px |
| lg | Laptop | 1024px |
| xl | Desktop | 1280px |
| 2xl | Desktop Grande | 1536px |

---

## 🔐 Segurança

### Boas Práticas Implementadas
- ✅ Tokens JWT armazenados em localStorage
- ✅ Requisições HTTP com `Authorization` header
- ✅ Validação de entrada em formulários
- ✅ CORS configurado no backend
- ✅ Proteção contra XSS com sanitização de dados

**Nota:** Não armazene senhas ou dados sensíveis no frontend.

---

## 🐛 Troubleshooting

### Problema: "CORS Error"
**Solução:** Certifique-se de que o backend está rodando e tem CORS habilitado:
```python
# Flask Backend
from flask_cors import CORS
CORS(app)
```

### Problema: "Socket.IO not connected"
**Solução:** Verifique se o Socket.IO está rodando no backend:
```python
from flask_socketio import SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")
```

### Problema: "Tailwind CSS não está carregando"
**Solução:** Verifique a conexão com a internet (CDN) ou use instalação local:
```bash
npm install -D tailwindcss
```

---

## 📚 Documentação Adicional

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Socket.IO Client Docs](https://socket.io/docs/v4/client-api/)
- [Chart.js Docs](https://www.chartjs.org/docs/latest/)
- [MDN JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

## 👥 Autores

- **Desenvolvedores:** 
  - [Ana Paula Máximo](https://github.com/AnaPaulaMaximo)
  - [Luis Gustavo](https://github.com/Luisglm7)
  - [Pedro Henrique](https://github.com/Pedrao345)
  - [Thimótio Araujo](https://github.com/Thimo08) 
- **Orientadores:** João Paulo e Rafael Ribas
- **Instituição:** SESI SENAI
- **Ano:** 2025

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 🔗 Repositório do Backend

Para acessar o código do backend desta aplicação, visite:

- **Backend Repository:** [https://github.com/AnaPaulaMaximo/TCC_Backend.git]
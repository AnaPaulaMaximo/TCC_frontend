# Repensei — (Backend)

Descrição: projeto para suporte a atividades de Filosofia e Sociologia com chat de IA, quizzes, flashcards e planos freemium/premium/adm.

**Principais funcionalidades**:
- **Chat IA**: Chat em tempo real via Socket.IO usando Google Generative AI (modelo configurável).
- **Autenticação**: Rotas de login/registro e diferenciação entre plano `freemium` e `premium`.
- **Quizzes & Flashcards**: Conteúdo armazenado e rotinas para gerar/avaliar atividades.
- **Gerenciamento de chaves**: Rotação e monitoramento das chaves de API (arquivo `api_key_manager.py`).

**Stack**:
- **Backend**: Python 3 + Flask, Flask-SocketIO.
- **Frontend**: HTML/CSS/JS estático (arquivos em `TCC_frontend`).

**Estrutura do projeto**
- **`TCC_Backend/`**: código do servidor Flask
  - `app.py`: aplicação principal e Socket.IO
  - `api_key_manager.py`: gerencia chaves da API GenAI
  - `auth_routes.py`, `freemium_routes.py`, `premium_routes.py`, `admin_routes.py`, `quiz_routes.py`: blueprints/rotas
  - `init_db.py`: inicializa banco SQLite (`repensei.db`)
  - `setup_keys.py`: helper para criar/configurar chaves iniciais
  - `requirements.txt`: dependências Python
  - `banco.sql`, `flashcards.json`, `questions.json`: dados e scripts auxiliares


**Pré-requisitos**
- Python 3.8+ instalado.
- Acesso à internet para chamadas à API GenAI (se usar o chatbot).

**Variáveis de ambiente**
- Crie um arquivo `.env` dentro de `TCC_Backend` contendo pelo menos:
  - `SECRET_KEY` — segredo da aplicação Flask.

As chaves da Google Generative AI são gerenciadas pelo `APIKeyManager`. Use `setup_keys.py` para adicionar chaves.

**Instalação (Windows / PowerShell)**
1. Abra PowerShell e navegue até a pasta do projeto (onde estão `TCC_Backend` e `TCC_frontend`).
2. Criar e ativar ambiente virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate
```

3. Instalar dependências do backend:

```powershell
pip install -r .\TCC_Backend\requirements.txt
```

4. Inicializar o banco de dados (opcional / recomendado na primeira execução):

```powershell
python .\TCC_Backend\init_db.py
```

5. Configurar chaves de API (se ainda não tiver chaves configuradas):

```powershell
python .\TCC_Backend\setup_keys.py
```

Nota: você também pode adicionar chaves manualmente usando `api_key_manager.APIKeyManager()` conforme comentários em `app.py`.

**Executando o backend**
- No PowerShell com o ambiente ativo, rode:

```powershell
python .\TCC_Backend\app.py
```

O servidor inicia com Socket.IO e estará acessível em `http://localhost:5000` por padrão.

**Executando o frontend**
- O frontend é estático. Para desenvolvimento rápido, abra `TCC_frontend\index.html` no navegador.
- Para servir os arquivos via HTTP (evita problemas de CORS ao testar localmente), rode:

```powershell
python -m http.server 8000 --directory .\TCC_frontend

# então abra http://localhost:8000
```

Observação: o backend já tem CORS habilitado (`CORS(app, origins="*", supports_credentials=True)`), portanto chamadas do frontend não devem ser bloqueadas.

**Endpoints e eventos importantes**
- `GET /` — rota principal (status simples)
- `GET /api/keys/status` — retorna status das chaves (uso administrativo; proteja em produção)
- `POST /api/keys/rotate` — força rotação de chave (administrativo)
- Socket.IO events:
  - `connect` — inicia conexão e sessão de chat
  - `enviar_mensagem` — evento para enviar mensagem do cliente ao bot (payload: `{ mensagem: "texto" }`)
  - `nova_mensagem` — evento enviado pelo servidor com resposta do bot

**Notas de segurança / produção**
- Nunca exponha suas chaves de API em repositórios públicos.
- Em produção, proteja rotas administrativas (`/api/keys/*`) com autenticação apropriada.
- Considere armazenar `repensei.db` em local seguro e fazer backups regulares.

**Testes rápidos**
- Inicialize o backend: `python .\TCC_Backend\app.py`.
- Abra o frontend ou rode o servidor HTTP, acesse `index.html` e teste o chat.

**Contato e autor**
- Projeto: Repensei
- Autores: 

---

# UniFicha Web - Frontend em React

Frontend completo em React para o sistema UniFicha, um sistema de fichas digitais para unidades básicas de saúde (UBS).

## 🚀 Características

- **Autenticação JWT** - Login e registro de usuários com validação de dados
- **Dashboard** - Visualização de fichas pendentes e histórico
- **Gestão de Fichas** - Criar, visualizar, cancelar fichas de atendimento
- **Agendas** - Consultar agendas disponíveis por especialidade
- **Perfil** - Editar dados pessoais e endereço
- **Alteração de Senha** - Alteração segura de senha
- **Design Responsivo** - Interface moderna com Tailwind CSS

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- API UniFicha rodando em http://localhost:3333

## 🔧 Instalação

1. **Instalar dependências**
```bash
npm install
```

2. **Configurar variáveis de ambiente**
```bash
cp .env.example .env.local
```

3. **Atualizar `.env.local` com a URL da API** (se necessário)
```
VITE_API_URL=http://localhost:3333
```

4. **Iniciar o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── Navbar.jsx      # Barra de navegação
├── context/            # Context API para estado global
│   └── AuthContext.jsx # Autenticação
├── hooks/              # Custom hooks
│   └── useAuth.js      # Hook de autenticação
├── pages/              # Páginas da aplicação
│   ├── Welcome.jsx     # Página inicial
│   ├── Login.jsx       # Login
│   ├── Register.jsx    # Registro
│   ├── Home.jsx        # Dashboard
│   ├── Fichas.jsx      # Gestão de fichas
│   ├── Ubs.jsx         # Consulta de agendas
│   ├── Profile.jsx     # Perfil do usuário
│   └── ChangePassword.jsx # Alteração de senha
├── services/           # Serviços de API
│   ├── api.js          # Função base de requisições
│   ├── auth.js         # Autenticação
│   ├── fichas.js       # Fichas
│   ├── agenda.js       # Agendas
│   ├── usuarios.js     # Usuários
│   └── ubs.js          # UBS (se necessário)
├── utils/              # Utilitários
│   ├── errors.js       # Tratamento de erros
│   ├── validators.js   # Validações
│   └── formatters.js   # Formatação de dados
├── types/              # Tipos (se TypeScript)
│   └── index.js
├── App.jsx             # Componente raiz
└── main.jsx            # Entrada da aplicação
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

1. **Login** - O usuário faz login com CPF, CNS ou login + senha
2. **Token armazenado** - O token é armazenado no localStorage
3. **Requisições autenticadas** - O token é incluído em todas as requisições à API
4. **Validação** - Na inicialização, o token é validado automaticamente

## 🎯 Fluxo de Uso

### 1. Novo Usuário
```
Visitante → Welcome → Register (criar conta) → Login → Home
```

### 2. Usuário Existente
```
Visitante → Login → Home (dashboard)
```

### 3. Solicitar Ficha
```
Home → Fichas → (criar nova ficha) → sucesso
      → Ubs → (visualizar agendas) → Fichas → (criar ficha)
```

### 4. Gerenciar Perfil
```
Home → Menu (usuário) → Perfil/Alterar Senha
```

## 🌐 Endpoints Integrados

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Dados do usuário autenticado
- `GET /auth/validate-token` - Validar token
- `PATCH /auth/change-password` - Alterar senha
- `POST /auth/forgot-password` - Solicitar reset de senha
- `POST /auth/reset-password` - Reset de senha

### Usuários
- `POST /usuarios` - Criar novo usuário (registro)
- `GET /usuarios/:id` - Obter dados do usuário
- `PUT /usuarios/:id` - Atualizar dados do usuário
- `GET /usuarios` - Listar usuários (ADMIN/GESTOR)
- `DELETE /usuarios/:id` - Deletar usuário (ADMIN)

### Fichas
- `POST /fichas` - Criar ficha
- `GET /fichas` - Listar fichas
- `GET /fichas/me` - Minhas fichas
- `GET /fichas/:id` - Obter ficha específica
- `PATCH /fichas/:id/status` - Atualizar status
- `DELETE /fichas/:id` - Cancelar ficha
- `DELETE /fichas/:id/hard` - Deletar permanentemente (ADMIN)

### Agendas
- `GET /agenda` - Listar agendas
- `GET /agenda/:id` - Obter agenda específica
- `POST /agenda` - Criar agenda (GESTOR/ADMIN)
- `PUT /agenda/:id` - Atualizar agenda (GESTOR/ADMIN)
- `DELETE /agenda/:id` - Deletar agenda (GESTOR/ADMIN)
- `DELETE /agenda/:id/hard` - Deletar permanentemente (ADMIN)

## 🎨 Design System

### Cores
- **Teal/Saúde**: `#0d9488` - Cor primária
- **Coral Alta**: `#f87171` - Alertas/Erros
- **Verde Acesso**: `#16a34a` - Sucesso
- **Âmbar Atenção**: `#f59e0b` - Avisos

## 📱 Responsividade

A aplicação é totalmente responsiva:
- **Mobile**: Layout em coluna única
- **Tablet**: Layout em 2 colunas
- **Desktop**: Layout em 3+ colunas

## 🚦 Tratamento de Erros

Erros são tratados de forma inteligente com mensagens claras:
- 400: Dados inválidos
- 401: Sessão expirada
- 403: Sem permissão
- 404: Não encontrado
- 409: Conflito (CPF duplicado, cota atingida, etc)
- 422: Dados não podem ser processados

## ✅ Validações

### Frontend
- CPF (11 dígitos)
- CNS (15 dígitos)
- Email (formato válido)
- Senha (mínimo 8 caracteres)
- CEP (8 dígitos)
- UF (2 caracteres, estados válidos)
- Login (3+ caracteres)

## 🔄 Estado Global

Usando Context API para:
- Autenticação (user, token, signed)
- Dados do usuário
- Erros globais

## 🚀 Build para Produção

```bash
npm run build
```

Isso gera uma pasta `dist/` pronta para deploy.

## 📝 Variáveis de Ambiente

### Desenvolvimento
```
VITE_API_URL=http://localhost:3333
```

### Produção
```
VITE_API_URL=https://api.unificha.com
```

## 🤝 Padrões de Código

- **Componentes**: Functional components com Hooks
- **Estado**: Context API + localStorage
- **Requisições**: Async/await com try/catch
- **Styling**: Tailwind CSS
- **Naming**: camelCase para variáveis, PascalCase para componentes

## 👥 Equipe

- Desenvolvido pela Escola de Ciências e Tecnologia (ECT) da UFRN
- Disciplina: Ciência e Tecnologia Aplicada 3
- Equipe: Débora Nicolly, Denyson Barros, Ester Bendicto, Hallen Vinicius, Matheus Ramos, Misla Wislaine, Paulo Guilherme e Pedro Batista

## 📄 Licença

ISC
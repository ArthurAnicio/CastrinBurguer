# 🥓 Castrin Burguer 🍔


Castrin Burguer é um sistema completo para gerenciar pedidos de hambúrgueres, combinando uma interface moderna em React com um backend robusto em Node.js. Explore as funcionalidades incríveis e saboreie a simplicidade do código! 🚀

## Imagens 🌆

![user](https://raw.githubusercontent.com/ArthurAnicio/CastrinBurguer/main/client/public/assets/user.png)

![product](https://raw.githubusercontent.com/ArthurAnicio/CastrinBurguer/main/client/public/assets/product.png)

![cart](https://raw.githubusercontent.com/ArthurAnicio/CastrinBurguer/main/client/public/assets/cart.png)

![adm](https://raw.githubusercontent.com/ArthurAnicio/CastrinBurguer/main/client/public/assets/adm.png)

![adm-product](https://raw.githubusercontent.com/ArthurAnicio/CastrinBurguer/main/client/public/assets/adm-product.png)
  
## 📂 Estrutura do Projeto
### 🎨 Cliente
  Framework: React + TypeScript
  Build Tool: Vite
  Dependências Principais:

    🌐 React: Biblioteca para criar interfaces de usuário.

    🔀 React Router: Navegação entre páginas.

    📡 Axios: Para chamadas HTTP assíncronas.

  ⚙️ Scripts Disponíveis

  Os comandos abaixo podem ser executados na pasta client:

    npm run dev        # 🚧 Inicia o servidor de desenvolvimento

    npm run build      # 🏗️ Gera a build para produção

    npm run preview    # 👀 Previsualiza a build de produção

    npm run lint       # ✅ Verifica o código com padrões ESLint


### 💾 Servidor
 
Framework: Express + TypeScript


Banco de Dados: SQLite via Knex.js


Dependências Principais:
  
  🔑 JWT: Gerenciamento de tokens de autenticação.
  
  🌍 CORS: Configuração de permissões de acesso.
  
  📜 Knex: Manipulação e migração de banco de dados.
  
  ⚙️ Scripts Disponíveis

Os comandos abaixo podem ser executados na pasta server:

    npm run start      # 🚀 Inicia o servidor

    npm run migrate    # 📂 Aplica as migrações no banco de dados
  
## 🛠️ Como Configurar e Executar

  1️⃣ Clone o Repositório

    git clone (https://github.com/ArthurAnicio/CastrinBurguer.git)

    cd CastrinBurguer
  
  2️⃣ Configuração do Cliente

    cd client

    npm install

    npm run dev
    
  O cliente será iniciado em: http://localhost:5173 🌐

3️⃣ Configuração do Servidor

    cd ../server
  
    npm install
  
    npm run migrate
  
    npm start
  
  O servidor estará disponível em: http://localhost:3000 🔗

## ✨ Funcionalidades
### Frontend 🖥️:

  📋 Interface moderna para gerenciar pedidos.
  
  🛤️ Rotas configuradas com React Router.

### Backend 🛠️:
  
  🌟 API RESTful para manipular dados do cliente.
  
  🔒 Autenticação segura com JWT.
  
  📦 Banco de dados embutido usando SQLite.

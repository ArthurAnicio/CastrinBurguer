🥓 Castrin Burguer 🍔
Castrin Burguer é um sistema completo para gerenciar pedidos de hambúrgueres, combinando uma interface moderna em React com um backend robusto em Node.js. Explore as funcionalidades incríveis e saboreie a simplicidade do código! 🚀

📂 Estrutura do Projeto
🎨 Cliente
Framework: React + TypeScript
Build Tool: Vite
Dependências Principais:
🌐 React: Biblioteca para criar interfaces de usuário.
🔀 React Router: Navegação entre páginas.
📡 Axios: Para chamadas HTTP assíncronas.
⚙️ Scripts Disponíveis
Os comandos abaixo podem ser executados na pasta client:

bash
Copiar código
npm run dev        # 🚧 Inicia o servidor de desenvolvimento
npm run build      # 🏗️ Gera a build para produção
npm run preview    # 👀 Previsualiza a build de produção
npm run lint       # ✅ Verifica o código com padrões ESLint
💾 Servidor
Framework: Express + TypeScript
Banco de Dados: SQLite via Knex.js
Dependências Principais:
🔑 JWT: Gerenciamento de tokens de autenticação.
🌍 CORS: Configuração de permissões de acesso.
📜 Knex: Manipulação e migração de banco de dados.
⚙️ Scripts Disponíveis
Os comandos abaixo podem ser executados na pasta server:

bash
Copiar código
npm run start      # 🚀 Inicia o servidor
npm run migrate    # 📂 Aplica as migrações no banco de dados
🛠️ Como Configurar e Executar
1️⃣ Clone o Repositório
bash
Copiar código
git clone <url-do-repositorio>
cd CastrinBurguer
2️⃣ Configuração do Cliente
bash
Copiar código
cd client
npm install
npm run dev
O cliente será iniciado em: http://localhost:3000 🌐

3️⃣ Configuração do Servidor
bash
Copiar código
cd ../server
npm install
npm run migrate
npm run start
O servidor estará disponível em: http://localhost:5000 🔗

✨ Funcionalidades
Frontend 🖥️:
📋 Interface moderna para gerenciar pedidos.
🛤️ Rotas configuradas com React Router.
Backend 🛠️:
🌟 API RESTful para manipular dados do cliente.
🔒 Autenticação segura com JWT.
📦 Banco de dados embutido usando SQLite.
📸 Preview do Projeto
Adicione capturas de tela ou GIFs aqui para demonstrar o projeto visualmente.

📜 Licença
Distribuído sob a licença MIT. Sinta-se à vontade para usar e modificar o projeto! 🎉

💡 Dica: Se precisar de ajuda, sinta-se à vontade para abrir uma issue ou contribuir com melhorias no repositório! 💻✨
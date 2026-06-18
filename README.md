# Bet Acadêmica - Sistema Simulado de Apostas Esportivas

## 👥 Integrantes
* [Gabriel Damasceno Coelho]
* [Danyel Henrique]

## 💻 Descrição do Sistema
O Bet Acadêmica é uma plataforma web desenvolvida em React que simula um sistema de apostas esportivas. A aplicação possui dois perfis de acesso:
* **Administrador:** Responsável por cadastrar novos eventos esportivos e definir as odds (cotações).
* **Jogador:** Pode visualizar as partidas disponíveis, consultar seu saldo fictício e realizar apostas.

## 🚀 Funcionalidade Extra Escolhida
**Ranking de jogadores com maior saldo.
Historico de apostas**

## 🛠️ Tecnologias Utilizadas
* React (Vite)
* React Router DOM (Navegação)
* Context API (Gerenciamento de Estado/Autenticação)
* JSON Server (Backend simulado/API)
* CSS puro para estilização

## ⚙️ Como executar o projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/DevGDamasceno/bet-academica
   cd bet-academica
   npm install

### 2. Rodando a API (JSON Server)
Abra um terminal no VS Code, na raiz do projeto, e inicie o banco de dados fake:

```bash
npx json-server --watch db.json --port 3000

O servidor estará rodando em: http://localhost:3000/clientes

### 4. Rodando o Front-end (React + Vite)
Abra um novo terminal (mantendo o anterior aberto) e rode o servidor de desenvolvimento:

npm run dev

Acesse a aplicação no navegador através do link gerado no terminal (geralmente http://localhost:5173)

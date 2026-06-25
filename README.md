# 🚀 Mobile Teams & Tasks - Challenge

Aplicação Fullstack para gerenciamento de equipes e tarefas, desenvolvida como parte de um desafio técnico. O objetivo é oferecer uma solução simples e funcional para organização de times, distribuição de tarefas e acompanhamento de progresso através de uma API REST e uma aplicação mobile.

---

# 📖 Visão Geral

O projeto é composto por duas aplicações:

* **Backend:** API REST desenvolvida em Node.js, TypeScript, Express e Prisma ORM.
* **Frontend:** Aplicação mobile desenvolvida com React Native e TypeScript.

A proposta principal é permitir que usuários gerenciem equipes e tarefas de forma centralizada, mantendo uma arquitetura organizada e de fácil evolução.

---

# 🎯 Objetivos do Projeto

* Criar e gerenciar equipes.
* Criar e gerenciar tarefas.
* Associar tarefas a um ou mais times.
* Atualizar status de tarefas.
* Consultar equipes e tarefas através da API.
* Consumir os dados através de uma aplicação mobile.

---

# 🗄 Modelo de Dados

O banco de dados utiliza **SQLite**, escolhido por sua simplicidade de configuração e facilidade de execução local.

## Entidades

### Team (Time)

Representa uma equipe de trabalho.

| Campo       | Tipo         |
| ----------- | ------------ |
| id          | String(uuid) |
| name        | String       |
| description | String       |
| color       | String (HEX) |
| createdAt   | DateTime     |

### Task (Tarefa)

Representa uma atividade a ser executada.

| Campo       | Tipo     |
| ----------- | -------- |
| id          | String(uuid) |
| title       | String   |
| description | String   |
| status      | Enum     |
| dueDate     | DateTime |
| createdAt   | DateTime |

### Status da Tarefa

```text
PENDENTE
EM_PROGRESSO
CONCLUIDA
```

## Relacionamento

Foi utilizado um relacionamento **Muitos para Muitos (N:N)** entre Times e Tarefas.

Uma tarefa pode ser atribuída a vários times e um time pode possuir várias tarefas.

---

# 🏗 Arquitetura

## Backend

A estrutura foi organizada em camadas para manter responsabilidades bem definidas:

```text
src
├── controllers
├── services
├── routes
├── prisma
└── server.ts
```

### Responsabilidades

#### Controllers

Recebem as requisições HTTP e retornam as respostas.

#### Services

Contêm as regras de negócio da aplicação.

#### Routes

Mapeiam os endpoints da API.

#### Prisma

Responsável pela comunicação com o banco de dados.

---

## Frontend

A aplicação mobile foi organizada em módulos e componentes reutilizáveis.

```text
src
├── components
├── screens
├── services
├── routes
├── types
└── 
```

---

# 🛠 Tecnologias Utilizadas

## Backend

* Node.js
* TypeScript
* Express
* Prisma ORM
* SQLite

## Frontend

* React Native
* TypeScript
* React Navigation
* TanStack Query (React Query)
* React Hook Form
* Zod
* NativeWind (Tailwind CSS)

---

# 💡 Decisões Técnicas

## TanStack Query

Foi utilizado para gerenciamento do estado proveniente da API (*Server State*), reduzindo a complexidade de sincronização manual dos dados.

## React Hook Form + Zod

A combinação foi utilizada para:

* Validação de formulários

## SQLite

Foi escolhido por:

* Facilidade de configuração
* Reprodutibilidade local
* Rapidez para desenvolvimento e testes

Em um cenário de produção, a evolução natural seria para PostgreSQL.

---

# ⚠️ Transparência Sobre o Desenvolvimento

Este projeto foi desenvolvido dentro de um prazo limitado de entrega.

Por esse motivo, algumas decisões foram tomadas para priorizar a implementação das funcionalidades principais e a entrega de uma solução funcional.

## Simplificações Realizadas

### Gerenciador de Pacotes

Foi utilizado **npm** ao invés de **Yarn** ou **pnpm**.

Motivo:

* Menor tempo de configuração.
* Ferramenta já presente por padrão no Node.js.

### Banco de Dados

Foi utilizado SQLite ao invés de PostgreSQL.

Motivo:

* Configuração extremamente rápida.
* Facilidade para execução e avaliação do projeto.

### Autenticação

O fluxo de autenticação não foi implementado.

Em uma evolução futura seriam adicionados:

* JWT
* Refresh Tokens
* Controle de permissões
* Persistência de sessão

### Gerenciamento Global de Estado

Não foi implementado Redux ou Context API global.

Como a aplicação possui escopo reduzido, o React Query atendeu às necessidades atuais.

### UX/UI

O foco principal foi a implementação funcional das regras de negócio.

Ainda existem melhorias visuais que poderiam ser adicionadas:

* Biblioteca completa de ícones
* Feedbacks visuais mais ricos
* Skeleton Loading
* Melhor responsividade
* Refinamentos de layout

### Tratamento de Erros

Os cenários principais foram tratados.

Entretanto, ainda existem oportunidades para:

* Mensagens mais amigáveis
* Tratamento centralizado de erros
* Logs estruturados
* Monitoramento em produção

---

# ⚙️ Como Executar

## Pré-Requisitos

* Node.js >= 22.11.0
* Android Studio
* Emulador Android configurado

---

## Backend

Entre na pasta:

```bash
cd Backend
```

Instale as dependências:

```bash
npm install
```

Configure o banco:

```bash
npm run db:setup
```

Execute a aplicação:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

---

## Frontend

Entre na pasta:

```bash
cd Frontend/ReactNativeMobile
```

Instale as dependências:

```bash
npm install
```

Execute o aplicativo:

```bash
npm run android
```

---

# 📖 Documentação de Rotas da API

**URL Base:** `/api`

---

## 👥 Contexto: Equipas (Teams)

### 1. Criar uma Equipa
- **Método:** `POST`
- **Endpoint:** `/api/teams`
- **Body (JSON):**
    ```json
    {
      "name": "Nome da Equipa",
      "colorHex": "#FF0000",
      "description": "Descrição opcional"
    }
    ```

### 2. Listar Equipas
- **Método:** `GET`
- **Endpoint:** `/api/teams`
- **Query Parameters:**
  - `limit` (opcional): Quantidade máxima de registos a retornar (padrão: 10).
  - `offset` (opcional): Quantidade de registos a saltar para paginação (padrão: 0).
  - `search` (opcional): Termo para busca por nome.

### 3. Obter Equipa por ID
- **Método:** `GET`
- **Endpoint:** `/api/teams/:id`

### 4. Obter Tarefas de uma Equipa
- **Método:** `GET`
- **Endpoint:** `/api/teams/:id/tasks`

### 5. Atualizar uma Equipa
- **Método:** `PUT`
- **Endpoint:** `/api/teams/:id`
- **Body (JSON):**
    ```json
    {
      "name": "Novo Nome",
      "colorHex": "#00FF00",
      "description": "Nova descrição"
    }
    ```

### 6. Eliminar uma Equipa
- **Método:** `DELETE`
- **Endpoint:** `/api/teams/:id`

---

## 📝 Contexto: Tarefas (Tasks)

### 1. Criar uma Tarefa
- **Método:** `POST`
- **Endpoint:** `/api/tasks`
- **Body (JSON):**
    ```json
    {
      "title": "Título da tarefa",
      "description": "Descrição detalhada",
      "status": "pending", 
      "dueDate": "2026-12-31T23:59:59Z", 
      "teamIds": ["id-da-equipa-1"] 
    }
    ```

### 2. Listar Tarefas
- **Método:** `GET`
- **Endpoint:** `/api/tasks`
- **Query Parameters:**
  - `limit` (opcional): Quantidade máxima de registos a retornar (padrão: 10).
  - `offset` (opcional): Quantidade de registos a saltar para paginação (padrão: 0).
  - `search` (opcional): Termo para busca no título ou descrição.
  - `teamId` (opcional): Filtrar pelas tarefas de uma equipa específica.
  - `status` (opcional): Filtrar pelo estado (ex: "pending", "completed").
  - `sort` (opcional): Ordem da listagem (`asc` ou `desc`).

### 3. Obter Tarefa por ID
- **Método:** `GET`
- **Endpoint:** `/api/tasks/:id`

### 4. Atualizar uma Tarefa
- **Método:** `PUT`
- **Endpoint:** `/api/tasks/:id`
- **Body (JSON):**
    ```json
    {
      "title": "Novo Título",
      "status": "completed"
    }
    ```

### 5. Eliminar uma Tarefa
- **Método:** `DELETE`
- **Endpoint:** `/api/tasks/:id`

### 6. Desvincular Equipa de uma Tarefa
- **Método:** `DELETE`
- **Endpoint:** `/api/tasks/:taskId/teams/:teamId`

---

# 🚀 Evoluções Futuras

Caso o projeto evoluísse para um ambiente de produção, as prioridades seriam:

## Segurança

* JWT

## Performance

* PostgreSQL

## Observabilidade

* Health Checks

## Experiência do Usuário

* Ícones

---

# 📌 Considerações Finais

O principal objetivo deste projeto foi demonstrar capacidade de modelagem, organização arquitetural, integração Fullstack e desenvolvimento mobile dentro do prazo proposto.

Algumas decisões foram simplificadas propositalmente para priorizar a entrega das funcionalidades essenciais, mantendo o código organizado, legível e preparado para futuras evoluções.

Feedbacks e sugestões são muito bem-vindos.

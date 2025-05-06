# Avaliador de Disciplinas

Um sistema de avaliação de disciplinas desenvolvido como projeto acadêmico para a disciplina de DAC (Desenvolvimento de Aplicações Corporativas).

## 🎯 Objetivo
Permitir que alunos atribuam notas e deixem feedbacks sobre disciplinas, com controle de acesso para diferentes papéis (Aluno, Professor, Administrador).

## 🚀 Funcionalidades

- **Autenticação e Autorização** via JWT
- **Controle de permissões**:
  - **Aluno** (USER): criar e listar suas próprias avaliações
  - **Professor** (TEACHER): editar apenas seu próprio perfil e consultar avaliações
  - **Administrador** (ADMIN): gerenciar alunos, professores, disciplinas e avaliações
- **CRUD de entidades**:
  - Alunos, Professores, Disciplinas, Avaliações
- **Filtragem dinâmica** de avaliações por nome do aluno
- **UI responsiva** com React + Material UI

## 🛠 Tecnologias

| Camada       | Tecnologia                      |
|--------------|---------------------------------|
| Frontend     | React, Vite, Material UI, Axios |
| Backend      | Spring Boot (Java), JWT         |
| Banco de Dados | Postgres |
| Gerenciamento de Dependências | Maven                  |

## 📦 Pré-requisitos

- Java 17 ou superior
- Node.js 16+ e npm
- Git

## 🔧 Instalação e Execução

### Backend

1. Clone o repositório e acesse a pasta do backend:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd AvaliaEdu/demo
   ```
2. Compile e execute com Maven:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   O servidor estará disponível em `http://localhost:8080`.

### Frontend

1. Na pasta do frontend:
   ```bash
   cd AvaliaEdu/front-AvaliEdu
   ```
2. Instale as dependências e inicie:
   ```bash
   npm install
   npm run dev
   ```
   A aplicação React estará disponível em `http://localhost:5173`.

## 📋 Uso

1. Acesse `http://localhost:5173`
2. Faça login com um dos perfis pré-cadastrados:
   - **Admin**: `admin@admin.com` / `admin123`
   - **Professor** e **Aluno** devem ser criados via API ou interface (somente Admin).
3. Navegue pelas telas de Alunos, Professores, Disciplinas e Avaliações, conforme seu papel.

---

> Projeto em desenvolvimento


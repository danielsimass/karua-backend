# 🗓️ Karuá CRM – Development Roadmap

Este documento define o plano de desenvolvimento inicial do **Karuá CRM**, dividido por fases e tarefas.  
O foco inicial será no **backend** (NestJS + TypeORM + PostgreSQL + Redis + Temporal.io), seguido por implementação de funcionalidades principais.

---

## 🧱 1. Project Setup & Infrastructure

### 🛠️ Core Environment
- [x] Inicializar repositório Git e estrutura base do projeto (`karua-crm-backend`)
- [x] Configurar ambiente com Docker e Docker Compose
- [x] Criar container do PostgreSQL e Redis
- [x] Configurar conexão com banco via TypeORM
- [x] Criar arquivos `.env` e `.env.example`
- [x] Configurar ESLint, Prettier e para lint e pre-commit hooks

### ⚙️ Core Framework Setup
- [x] Criar aplicação base com NestJS
- [x] Configurar `ConfigModule` para variáveis de ambiente
- [ ] Configurar `Logger` global
- [ ] Configurar interceptors e filters globais (ex.: erros, responses padronizados)
- [ ] Adicionar Swagger (OpenAPI) para documentação automática
- [ ] Configurar validações com `class-validator` e `class-transformer`
- [ ] Criar estrutura de módulos base (`core`, `shared`, etc.)

### 🕰️ Temporal.io
- [ ] Configurar ambiente Temporal local com Docker
- [ ] Criar conexão com Temporal no NestJS
- [ ] Criar workflow e activity de exemplo (ex.: enviar e-mail ou gerar relatório)
- [ ] Estruturar pasta de workflows e atividades para uso futuro

---

## 🗄️ 2. Database & Entities

### 📁 Core Entities
- [ ] Criar entidade `hosts` (representa pousadas/hotéis)
- [ ] Criar entidade `users` com referência a `hosts`
- [ ] Criar entidade `customers`
- [ ] Criar entidade `identifications` (documentos dos clientes)
- [ ] Criar entidade `countries` (lista de países)
- [ ] Criar entidade `rooms`
- [ ] Criar entidade `room_pricings`
- [ ] Criar entidade `reservations`

### 🗃️ Database Enhancements
- [ ] Configurar índices e constraints (incluindo índices compostos por `host_id`)
- [ ] Criar seeds iniciais (`countries`, usuários admin, etc.)
- [ ] Escrever migrations com TypeORM
- [ ] Configurar scripts de migração (`npm run migration:run` etc.)

---

## 🔐 3. Authentication & Authorization

### 👤 Auth Module
- [ ] Criar módulo de autenticação (`auth`)
- [ ] Implementar login com e-mail e senha
- [ ] Implementar geração e validação de JWT
- [ ] Criar guarda global de autenticação
- [ ] Implementar recuperação de senha (workflow com Temporal)
- [ ] Criar sistema de roles e permissões (`admin`, `staff`, etc.)

### 👥 User Management
- [ ] Endpoint para criar usuários (`POST /users`)
- [ ] Endpoint para listar usuários (`GET /users`)
- [ ] Endpoint para atualizar e deletar usuários
- [ ] Endpoint para alterar senha e perfil do usuário

---

## 👤 4. Customers Management

### 🧾 Customers Module
- [ ] Endpoint para criar `customer` com `identifications`
- [ ] Endpoint para listar clientes com filtros (nome, documento, nacionalidade)
- [ ] Endpoint para atualizar e deletar clientes
- [ ] Implementar paginação e ordenação
- [ ] Criar índices e constraints de unicidade por `host_id + document_number`

---

## 🏨 5. Rooms & Pricing

### 🏠 Rooms Module
- [ ] Endpoint para criar, listar, atualizar e deletar `rooms`
- [ ] Endpoint para associar quartos a um `host`
- [ ] Implementar filtros (capacidade, tipo, status)

### 💵 Room Pricing Module
- [ ] Endpoint para criar e atualizar tarifas (`room_pricings`)
- [ ] Implementar lógica de precificação dinâmica (temporal workflows)
- [ ] Endpoint para consultar preços por período

---

## 📅 6. Reservations Management

### 📑 Reservations Module
- [ ] Endpoint para criar reservas (`reservations`)
- [ ] Endpoint para listar reservas por cliente, data, status
- [ ] Implementar regras de negócio (check-in/check-out, conflitos, limites)
- [ ] Criar workflow de confirmação e cancelamento com Temporal
- [ ] Implementar integração com e-mail (confirmação automática)

---

## 🧪 7. Testing & QA

### 🧰 Automated Testing
- [ ] Configurar Jest e criar testes unitários
- [ ] Criar testes de integração para módulos principais
- [ ] Criar testes E2E simulando fluxo completo (auth → reserva)

### 🔍 Quality & Security
- [ ] Configurar auditoria de segurança com `helmet`
- [ ] Implementar rate limiting
- [ ] Configurar logs estruturados (JSON) e métricas
- [ ] Criar rotinas de backup e restore do banco

---

## 🚀 8. Deployment & Monitoring

### ☁️ Infrastructure
- [ ] Configurar build e publish com Dockerfile otimizado
- [ ] Criar `docker-compose.prod.yml` para produção
- [ ] Preparar ambiente de staging com CI/CD
- [ ] Configurar monitoramento (Prometheus + Grafana)
- [ ] Configurar logs centralizados (ELK Stack ou Loki)

---

## 📚 9. Documentation & Finalization

- [ ] Atualizar documentação da API (Swagger)
- [ ] Documentar entidades e relacionamentos (`DB_SCHEMA.md`)
- [ ] Criar `API_GUIDE.md` com exemplos de requisições
- [ ] Criar `DEPLOYMENT_GUIDE.md`
- [ ] Revisar e atualizar roadmap conforme novas features

---

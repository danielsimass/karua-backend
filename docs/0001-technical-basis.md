# Karuá CRM — Documentação Inicial

**Karuá CRM** é uma plataforma para gestão de hotéis e pousadas — início focado em gerenciamento de tarifas/quartos, reservas e cadastro de clientes. O backend será a prioridade (API), com front-end posterior.

---

## Visão e objetivos

**Visão:** ser a plataforma brasileira de referência para pequenas e médias hospedagens, priorizando simplicidade, eficiência e localidade (brasilidade).

**Objetivos principais (MVP):**
- Gerenciar quartos e tarifas (preços por data/temporada).
- Gerenciar reservas (criar, alterar, cancelar, calendário de ocupação).
- Cadastro e histórico de clientes (busca por CPF, e-mail, telefone).
- Ter uma API modular, testável e preparada para escalabilidade (cache, workers/temporal, containers).

---

## Stack técnica proposta

- **Backend:** NestJS (TypeScript)
- **ORM:** TypeORM
- **Banco:** PostgreSQL
- **Cache / Sessões:** Redis
- **Orquestração de workflows / tarefas assíncronas:** Temporal.io
- **Contêineres / Infra local:** Docker / Docker Compose (provisionamento inicial)
- Planejamento de deploy: containers + orquestrador (k8s) quando necessário

---

## Arquitetura proposta (visão de alto nível)

- **Modular monolith** inicialmente (módulos bem definidos por recurso) — facilita desenvolvimento rápido e testes; pode migrar para microservices por bounded contexts no futuro.
- **Separation of concerns:** controllers → services → repositories (TypeORM) → atividades/workflows (Temporal).
- **Transações & concorrentia:** locks/transactions para evitar double-booking; usar workflows (Temporal) para processos longos e retries.

---

## Estrutura de arquivos (sugestão)

karua-crm/
├─ src/
│ ├─ modules/
│ │ ├─ clients/ # cadastro e histórico de hóspedes e suas entidades
│ │ ├─ rooms/ # quartos, categorias e atributos e suas entidades
│ │ ├─ rates/ # tarifas, sazonalidade e regras de preço e suas entidades
│ │ ├─ reservations/ # reservas, status e calendário
│ │ ├─ auth/ # usuários, roles, permissões
│ │ ├─ payments/ # integrações/registro de pagamentos (futuro)
│ │ └─ common/ # DTOs, pipes, interceptors, utils
│ ├─ database/
│ │ ├─ migrations/
│ │ └─ seeds/
│ ├─ workflows/ # temporal workflows & activities
│ ├─ cache/ # redis helpers / cache keys
│ ├─ config/ # config loaders, env schemas
│ ├─ infra/ # infra-level code (db adapters, redis client)
│ ├─ main.ts
│ └─ app.module.ts
├─ docs/
│ ├─ DB_SCHEMA.md
│ └─ API.md
├─ tests/
└─ ...

---

## Estratégia de cache (Redis)

- **Objetivos:** reduzir latência em leituras pesadas (disponibilidade, tarifas), armazenar sessões, rate-limiting, locks distribuídos leves.
- **Padrões de chave:** `karua:rooms:availability:<date_range>:<room_or_category>` ; `karua:rates:room:<room_id>:<date>` ; `karua:client:<id>`
- **TTL:** curto para dados altamente voláteis (ex.: disponibilidade 30s–5m), mais longo para dados estáticos (ex.: categorias).
- **Cache invalidation:** sempre invalidar/incrementar versão em updates (ex.: adicionar um `cache_version` ou `etag`).
- **Locks distribuídos:** usar RedLock ou mecanismos do Temporal para operações críticas (reservas concorrentes).

---

## Uso do Temporal.io (workflows)

- **Quando usar:** operações longas ou com retry/compensação (ex.: retenção de reserva pendente, confirmação por pagamento, envio de vouchers, reconciliações).
- **Exemplos de workflows:**
  - `reservation_expiration_workflow` — aguarda pagamento/confirm. e cancela se expirar.
  - `send_confirmation_workflow` — notifica cliente (SMS/Email) com retry/backoff.
  - `bulk_price_update_workflow` — atualizar tarifas em lote com rollback parcial se falha.
- **Boas práticas:** atividades idempotentes, versionamento de workflows, não manter lógica de negócio pesada em activities (delegar a services).

---

## Concorrência e prevenção de double-booking

- **Estratégias:**  
  1. Lock pessimista em transação no banco para reservar a linha de disponibilidade;  
  2. Utilizar *advisory locks* do Postgres para proteger lógica de reserva;  
  3. Orquestrar através de Temporal para evitar condições de corrida.
- **Recomendação inicial:** bloquear por `room_id` (ou `category_id`) durante verificação + criação da reserva dentro de transação.

---

## Segurança e conformidade

- **Autenticação:** JWT (com refresh tokens) ou OAuth2 dependendo do público (staff vs integrações).
- **Autorização:** RBAC (roles: admin, manager, receptionist) + permissões finas.
- **Senhas:** argon2 ou bcrypt forte; nunca armazenar senha em texto.
- **Dados sensíveis:** cifrar campos sensíveis em repouso (ex.: CPF/email) ou usar PostgreSQL pgcrypto se necessário.
- **LGPD:** manter políticas de retenção, consentimento, logs de acesso e possibilidade de anonimização/exclusão.
- **Transporte:** TLS obrigatório (HTTPS) em produção; conexões DB seguras.

---

## Observabilidade e operação

- **Logs:** logs estruturados (JSON) com `correlation_id` (propagado via headers).
- **Tracing & Metrics:** OpenTelemetry + Prometheus (metrics) + Jaeger (traces).
- **Alerts:** latência de endpoints críticos, filas de workflows, erros 5xx, uso de Redis/Postgres.
- **Backups:** rotina de dump/backup do PostgreSQL e testes de restore.

---

## Migrations, seeds e ambiente de desenvolvimento

- **Migrations:** TypeORM migrations versionadas; naming consistente (`<ts>-<descr>`) e revisão em PR.
- **Seeds:** dados mínimos para desenvolvimento (categorias, roles, admin user).
- **Não usar** `synchronize: true` em qualquer ambiente de produção.

---

## Testes e qualidade

- **Unit:** Jest (services, utils).
- **Integration:** testes com banco real (testcontainers ou uma instância postgres em CI), mocks para Redis/Temporal quando necessário.
- **E2E:** fluxo de reserva completo (criar cliente → reservar → confirmar).
- **Linters / formatação:** ESLint + Prettier; regras compartilhadas no projeto.
- **CI:** rodar lint, tests, build, migrations check.

---

## Boas práticas de API

- **Versionamento:** `/api/v1/...`
- **Contratos:** documentar com Swagger / OpenAPI.
- **Paginação:** cursor-based quando possível para listas grandes.
- **Erros:** respostas consistentes com `code`, `message`, `details`.
- **Idempotência:** endpoints de criação (ex.: criar reserva) devem suportar `Idempotency-Key` para evitar duplicação.

---

## Próximos passos imediatos

1. Gerar o arquivo `DB_SCHEMA.md` com DDL (tabelas, constraints, índices e exemplos de queries importantes).  
2. Definir as prioridades do MVP e um cronograma de sprints (posso sugerir um cronograma se quiser).  
3. Scaffold inicial do projeto (repos, módulos e migrations base).

---

## Observações finais

- Este documento é a **base técnica** e de decisões iniciais — a modelagem fina (relacionamentos, constraints e índices) será entregue no `DB_SCHEMA.md`.  
- Posso já iniciar **DB_SCHEMA.md** com as tabelas descritas acima e migrações de exemplo. Deseja que eu gere isso agora?

---

## 1. Convenções de Nomenclatura
*   **Tabelas:**
    *   **Case:** `snake_case` (ex: `billing_statements`, `unified_usage_events`).
    *   **Pluralização:** Use substantivos no **plural**.
        *   Correto: `subscriptions`, `chargeable_items`
        *   Incorreto: `subscription`, `chargeable_item`

*   **Colunas:**
    *   **Case:** `snake_case` (ex: `billing_cycle_id`, `charge_effective_date`).
    *   **Chaves Primárias (PK):** Sempre nomeie a coluna da chave primária como `id`.
    *   **Chaves Estrangeiras (FK):** Use o formato `{tabela_referenciada_no_singular}_id`.
        *   Correto: `subscription_id` na tabela `unified_usage_events` refere-se ao `id` na tabela `subscriptions`.
        *   Correto: `billing_cycle_id` na tabela `billing_statements` refere-se ao `id` na tabela `billing_cycles`.
    *   **Timestamps (Data e Hora):** Use o sufixo `_at` para colunas de timestamp (`TIMESTAMPTZ`).
        *   Exemplos: `created_at`, `updated_at`, `finalized_at`, `received_at`.
    *   **Datas:** Use o sufixo `_date` para colunas que armazenam apenas a data (`DATE`).
        *   Exemplos: `start_date`, `end_date`, `due_date`.
    *   **Booleanos:** Nomeie-os como afirmações positivas ou perguntas.
        *   Exemplos: `is_active`, `is_billable`, `has_been_processed`. Evite nomes negativos como `is_not_active`.
    *   **Valores (Amounts):** Use o sufixo `_amount` para valores monetários.
        *   Exemplos: `rated_charge_amount`, `taxes_amount`.

*   **Índices:**
    *   **Formato:** `idx_{table_name}_{columns}`. Para índices de múltiplas colunas, separe os nomes das colunas com um `_`.
        *   Exemplos: `idx_unified_usage_unrated`, `idx_billing_cycles_status`.
    *   **Restrições do tipo `UNIQUE`:** `unique_{table_name}_{columns}`.
        *   Exemplo: `unique_cycle_per_account`.

*   **Tipos Personalizados (ENUMs):**
    *   **Formato:** `{entity_name}_{attribute}_type` em `snake_case`.
        *   Exemplos: `usage_event_type`, `charge_processing_status`.

## **2. Tipos de Dados e Definições de Colunas**

*   **Chaves Primárias:** Use `UUID` para entidades que são expostas ou referenciadas por sistemas externos (`subscriptions`, `accounts`, `billing_statements`). Use `BIGSERIAL` para tabelas internas de alto volume, onde o desempenho é crítico e a referência externa não é necessária (`raw_carrier_records`, `unified_usage_events`).
*   **Timestamps:** Sempre use `TIMESTAMPTZ` (Timestamp com Fuso Horário). Armazene todos os horários em UTC.
*   **Valores Monetários:** Use `DECIMAL(18, 6)`.
*   **Texto e Strings:** Use `VARCHAR(n)` para strings com um comprimento máximo conhecido (ex: códigos de status, nomes) e `TEXT` para texto de tamanho ilimitado (ex: descrições, mensagens de erro).

## **3. Restrições e Integridade**

*   **`NOT NULL`:** Seja explícito. Toda coluna deve ser `NOT NULL`, a menos que haja uma razão de negócio clara para que seja opcional. Isso previne problemas de qualidade de dados na origem.
*   **Chaves Estrangeiras:** Sempre defina as restrições de chave estrangeira (`REFERENCES`). Isso garante que a integridade relacional seja mantida pelo próprio banco de dados. Use `ON DELETE RESTRICT` ou `ON DELETE SET NULL` de forma deliberada, dependendo da regra de negócio. Evite `ON DELETE CASCADE`, a menos que você tenha certeza absoluta dos efeitos posteriores.
*   **Valores `DEFAULT`:** Use `DEFAULT` para colunas como `id` (`gen_random_uuid()` ou `nextval()`), `created_at` (`NOW()`), e status iniciais (`'PENDING'`).
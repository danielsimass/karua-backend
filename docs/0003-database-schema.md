# Karuá CRM — Database Schema

Este documento define a modelagem completa do banco de dados do Karuá CRM, seguindo as convenções de nomenclatura e boas práticas estabelecidas.

## Convenções Aplicadas

- **Tabelas:** `snake_case` no plural
- **Colunas:** `snake_case` com sufixos apropriados (`_at` para timestamps, `_date` para datas, `_id` para FKs)
- **Chaves Primárias:** `id` (UUID para entidades expostas, BIGSERIAL para tabelas internas)
- **Timestamps:** `TIMESTAMPTZ` em UTC
- **Valores Monetários:** `DECIMAL(18, 6)`

## Entidades Principais

### 1. customers

Tabela principal para cadastro de clientes/hóspedes.

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    birth_date DATE,
    gender gender_enum,
    nationality_id UUID REFERENCES nationalities(id),
    host_id UUID REFERENCES hosts(id) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2. customer_documents

Documentos dos clientes (CPF, RG, Passaporte, etc.).

```sql
CREATE TABLE customer_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    document VARCHAR(50) NOT NULL,
    type document_type_enum NOT NULL,
    issuing_country VARCHAR(3), -- Código ISO do país emissor
    is_primary BOOLEAN NOT NULL DEFAULT false, -- Documento principal do cliente
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. customer_contacts

Contatos dos clientes (telefone, celular, etc.).

```sql
CREATE TABLE customer_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
    value VARCHAR(100) NOT NULL,
    type contact_type_enum NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false, -- Contato principal
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4. nationalities

Países/nacionalidades.

```sql
CREATE TABLE nationalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5. users

Usuários do sistema (funcionários, administradores).

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id) NOT NULL,
    host_id UUID REFERENCES hosts(id) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 6. roles

Funções/cargos dos usuários.

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 7. hosts

Estabelecimentos hoteleiros (hotéis, pousadas).

```sql
CREATE TABLE hosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cnpj VARCHAR(18),
    cep VARCHAR(10),
    street VARCHAR(255),
    number VARCHAR(20),
    state VARCHAR(2),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 8. legal_representatives

Representantes legais dos estabelecimentos.

```sql
CREATE TABLE legal_representatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    phone VARCHAR(20),
    host_id UUID REFERENCES hosts(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 9. accommodation_types

Tipos de acomodação (quarto simples, suíte, etc.).

```sql
CREATE TABLE accommodation_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL,
    rooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    min_occupants INTEGER NOT NULL DEFAULT 1,
    max_occupants INTEGER NOT NULL,
    host_id UUID REFERENCES hosts(id) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 10. accommodations

Acomodações específicas (quarto 101, suíte 201, etc.).

```sql
CREATE TABLE accommodations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accommodation_type_id UUID REFERENCES accommodation_types(id) NOT NULL,
    identifier VARCHAR(50) NOT NULL,
    floor INTEGER,
    status BOOLEAN NOT NULL DEFAULT true,
    host_id UUID REFERENCES hosts(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 11. accommodation_pricing_schedules

Cronograma de preços por tipo de acomodação.

```sql
CREATE TABLE accommodation_pricing_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accommodation_type_id UUID REFERENCES accommodation_types(id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(18, 6) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 12. bookings

Reservas de acomodações.

```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) NOT NULL,
    accommodation_id UUID REFERENCES accommodations(id) NOT NULL,
    price DECIMAL(18, 6) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payment_method payment_method_enum,
    check_in_date DATE,
    check_out_date DATE,
    is_canceled BOOLEAN NOT NULL DEFAULT false,
    is_paid BOOLEAN NOT NULL DEFAULT false,
    early_payment DECIMAL(18, 6) DEFAULT 0,
    is_early_paid BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 13. check_ins

Registro de check-ins.

```sql
CREATE TABLE check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 14. check_outs

Registro de check-outs.

```sql
CREATE TABLE check_outs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 15. requests_logs

Logs de requisições da API.

```sql
CREATE TABLE requests_logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    url VARCHAR(500) NOT NULL,
    status_code INTEGER NOT NULL,
    request_body JSONB,
    request_headers JSONB,
    response_body JSONB,
    response_headers JSONB
);
```

## Enums (Tipos Personalizados)

```sql
-- Gênero dos clientes
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other', 'not_informed');

-- Tipo de documento
CREATE TYPE document_type_enum AS ENUM (
    'cpf',           -- CPF (Brasil)
    'rg',            -- RG (Brasil)
    'cnh',           -- CNH (Brasil)
    'passport',      -- Passaporte (internacional)
    'dni',           -- DNI (Argentina)
    'cedula',        -- Cédula (Colômbia, Chile)
    'ruc',           -- RUC (Peru)
    'ci',            -- CI (Uruguai, Paraguai)
    'mercosul_id',   -- Documento Mercosul
    'other'          -- Outros documentos
);

-- Tipo de contato
CREATE TYPE contact_type_enum AS ENUM ('phone', 'mobile', 'whatsapp', 'email', 'other');

-- Método de pagamento
CREATE TYPE payment_method_enum AS ENUM ('cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'other');
```

## Índices

```sql
-- Índices para performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_host_id ON customers(host_id);
CREATE INDEX idx_customers_nationality_id ON customers(nationality_id);
CREATE INDEX idx_customers_host_email ON customers(host_id, email); -- Isolamento por host
CREATE INDEX idx_customers_active ON customers(host_id, is_active) WHERE is_active = true;

CREATE INDEX idx_customer_documents_customer_id ON customer_documents(customer_id);
CREATE INDEX idx_customer_documents_document ON customer_documents(document);
CREATE INDEX idx_customer_documents_type ON customer_documents(type);
CREATE INDEX idx_customer_documents_primary ON customer_documents(customer_id, is_primary) WHERE is_primary = true;

CREATE INDEX idx_customer_contacts_customer_id ON customer_contacts(customer_id);
CREATE INDEX idx_customer_contacts_type ON customer_contacts(type);
CREATE INDEX idx_customer_contacts_primary ON customer_contacts(customer_id, is_primary) WHERE is_primary = true;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_host_id ON users(host_id);
CREATE INDEX idx_users_role_id ON users(role_id);

CREATE INDEX idx_accommodations_type_id ON accommodations(accommodation_type_id);
CREATE INDEX idx_accommodations_host_id ON accommodations(host_id);
CREATE INDEX idx_accommodations_identifier ON accommodations(identifier);

CREATE INDEX idx_accommodation_types_host_id ON accommodation_types(host_id);

CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_accommodation_id ON bookings(accommodation_id);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_status ON bookings(is_canceled, is_paid);

CREATE INDEX idx_accommodation_pricing_schedules_type_id ON accommodation_pricing_schedules(accommodation_type_id);
CREATE INDEX idx_accommodation_pricing_schedules_dates ON accommodation_pricing_schedules(start_date, end_date);

CREATE INDEX idx_check_ins_booking_id ON check_ins(booking_id);
CREATE INDEX idx_check_outs_booking_id ON check_outs(booking_id);

CREATE INDEX idx_requests_logs_created_at ON requests_logs(created_at);
CREATE INDEX idx_requests_logs_status_code ON requests_logs(status_code);

-- Índices compostos para consultas complexas
CREATE INDEX idx_bookings_accommodation_dates ON bookings(accommodation_id, start_date, end_date);
CREATE INDEX idx_accommodation_availability ON accommodations(id, status) WHERE status = true;
```

## Restrições de Integridade

```sql
-- Restrições UNIQUE
ALTER TABLE customers ADD CONSTRAINT unique_customer_email_per_host UNIQUE (email, host_id);
ALTER TABLE users ADD CONSTRAINT unique_user_email_per_host UNIQUE (email, host_id);
ALTER TABLE users ADD CONSTRAINT unique_user_username_per_host UNIQUE (username, host_id);
ALTER TABLE accommodations ADD CONSTRAINT unique_accommodation_identifier_per_host UNIQUE (identifier, host_id);
ALTER TABLE legal_representatives ADD CONSTRAINT unique_legal_rep_cpf UNIQUE (cpf);

-- Restrições para documentos únicos por host
ALTER TABLE customer_documents ADD CONSTRAINT unique_document_per_customer UNIQUE (customer_id, document, type);
ALTER TABLE customer_documents ADD CONSTRAINT unique_primary_document_per_customer UNIQUE (customer_id) WHERE is_primary = true;

-- Restrições de CHECK
ALTER TABLE bookings ADD CONSTRAINT check_booking_dates CHECK (end_date > start_date);
ALTER TABLE accommodation_pricing_schedules ADD CONSTRAINT check_pricing_dates CHECK (end_date > start_date);
ALTER TABLE accommodations ADD CONSTRAINT check_floor_positive CHECK (floor >= 0);
ALTER TABLE accommodation_types ADD CONSTRAINT check_capacity_positive CHECK (capacity > 0);
ALTER TABLE accommodation_types ADD CONSTRAINT check_rooms_positive CHECK (rooms > 0);
ALTER TABLE accommodation_types ADD CONSTRAINT check_bathrooms_positive CHECK (bathrooms >= 0);
ALTER TABLE accommodation_types ADD CONSTRAINT check_min_occupants_positive CHECK (min_occupants > 0);
ALTER TABLE accommodation_types ADD CONSTRAINT check_max_occupants_positive CHECK (max_occupants > 0);
ALTER TABLE accommodation_types ADD CONSTRAINT check_max_occupants_gte_min CHECK (max_occupants >= min_occupants);
```

## Relacionamentos Principais

1. **Host → Users**: Um host tem muitos usuários
2. **Host → Customers**: Um host tem muitos clientes (isolamento por host)
3. **Host → Accommodations**: Um host tem muitas acomodações
4. **Host → Legal Representatives**: Um host tem representantes legais
5. **Accommodation Type → Accommodations**: Um tipo tem muitas acomodações
6. **Customer → Bookings**: Um cliente pode ter muitas reservas
7. **Accommodation → Bookings**: Uma acomodação pode ter muitas reservas
8. **Booking → Check-ins/Check-outs**: Uma reserva pode ter check-in e check-out
9. **Customer → Documents/Contacts**: Um cliente pode ter muitos documentos e contatos

## Isolamento por Host

O sistema implementa **isolamento completo por host**, garantindo que:

- Um usuário do Host A não pode acessar dados do Host B
- Um customer pode existir em múltiplos hosts (mesmo email/CPF)
- Todos os dados são filtrados automaticamente por `host_id`
- Índices otimizados para consultas por host

## Documentação Internacional

O sistema suporta diferentes tipos de documentos conforme a nacionalidade:

### Documentos por Região

- **Brasil**: CPF, RG, CNH
- **Mercosul**: DNI (Argentina), CI (Uruguai/Paraguai), Cédula (Chile/Colômbia)
- **Internacional**: Passaporte, Documento Mercosul
- **Outros**: RUC (Peru), outros documentos

### Regras de Documentação

- **Documento Principal**: Cada customer deve ter exatamente um documento marcado como `is_primary = true`
- **País Emissor**: Campo `issuing_country` para identificar o país emissor (código ISO 3 letras)
- **Flexibilidade**: Customer pode ter múltiplos documentos de tipos diferentes
- **Mercosul**: Clientes do Mercosul podem usar documentos regionais em vez de passaporte

## Observações de Design

- **UUIDs** são usados para entidades que podem ser expostas via API
- **BIGSERIAL** é usado apenas para `requests_logs` (tabela de alto volume)
- **Timestamps** sempre em UTC com `TIMESTAMPTZ`
- **Valores monetários** com precisão de 6 casas decimais
- **Soft deletes** implementados via campos `is_active` onde apropriado
- **Auditoria** básica com `created_at` e `updated_at` em todas as tabelas principais
- **Integridade referencial** mantida com foreign keys e constraints apropriadas

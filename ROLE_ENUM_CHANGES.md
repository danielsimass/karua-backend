# 🔄 Mudanças: Role como Enum

## 📋 Resumo das Alterações

A estrutura de `Role` foi refatorada de **entidade do banco de dados** para **enum TypeScript**, simplificando a arquitetura e melhorando a performance.

## ✨ O que mudou?

### Antes (Entidade)

```typescript
// Tabela roles no banco
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}

// User tinha roleId
@Entity('users')
export class User {
  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @ManyToOne(() => Role)
  role: Role;
}
```

### Depois (Enum)

```typescript
// Enum simples
export enum RoleType {
  ADMIN = 'admin',
  MANAGER = 'manager',
  RECEPTIONIST = 'receptionist',
  STAFF = 'staff',
}

// User tem role diretamente
@Entity('users')
export class User {
  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.STAFF,
  })
  role: RoleType;
}
```

## 🗄️ Banco de Dados

### Tipo Enum no PostgreSQL

```sql
CREATE TYPE "role_type_enum" AS ENUM ('admin', 'manager', 'receptionist', 'staff');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "username" VARCHAR(100) NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" "role_type_enum" NOT NULL DEFAULT 'staff',
  "host_id" uuid NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Usuário Admin Padrão

A migration cria automaticamente um usuário admin:

- **Email:** `admin@karua.com`
- **Username:** `admin`
- **Password:** `Admin@123` ⚠️ **MUDE APÓS PRIMEIRO LOGIN!**
- **Role:** `admin`

## 🔧 Mudanças no Código

### 1. Arquivos Criados

- ✅ `src/users/enums/role.enum.ts` - Enum RoleType

### 2. Arquivos Removidos

- ❌ `src/users/entities/role.entity.ts` - Não é mais necessário

### 3. Arquivos Modificados

#### User Entity

```typescript
// Antes
@Column({ type: 'uuid', name: 'role_id' })
roleId: string;

@ManyToOne(() => Role)
role: Role;

// Depois
@Column({
  type: 'enum',
  enum: RoleType,
  default: RoleType.STAFF,
})
role: RoleType;
```

#### CreateUserDto

```typescript
// Antes
@IsUUID('4')
roleId: string;

// Depois
@IsEnum(RoleType, {
  message: 'Role deve ser um valor válido: admin, manager, receptionist, staff'
})
role: RoleType;
```

#### JWT Payload

```typescript
// Antes
interface JwtPayload {
  role: string;
  roleId: string;
}

// Depois
interface JwtPayload {
  role: RoleType; // Sem roleId
}
```

#### UsersService

```typescript
// Removido - Não é mais necessário
async findAllRoles(): Promise<Role[]>
async findRoleById(id: string): Promise<Role>
```

#### UsersController

```typescript
// Antes
@Get('roles/all')
findAllRoles(): Promise<Role[]>

@Get('roles/:id')
findRoleById(@Param('id') id: string): Promise<Role>

// Depois
@Get('roles')
findAllRoles(): { role: string; description: string }[] {
  return [
    { role: RoleType.ADMIN, description: '...' },
    { role: RoleType.MANAGER, description: '...' },
    { role: RoleType.RECEPTIONIST, description: '...' },
    { role: RoleType.STAFF, description: '...' },
  ];
}
```

## 📝 Como Usar

### Criar Usuário

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "username": "joao",
    "password": "Senha123!",
    "role": "staff",
    "hostId": "uuid-do-host"
  }'
```

### Listar Roles Disponíveis

```bash
curl -X GET http://localhost:3000/users/roles
```

**Resposta:**

```json
[
  {
    "role": "admin",
    "description": "Administrador do sistema com acesso total"
  },
  {
    "role": "manager",
    "description": "Gerente com acesso a gestão e relatórios"
  },
  {
    "role": "receptionist",
    "description": "Recepcionista com acesso a reservas e check-in/out"
  },
  {
    "role": "staff",
    "description": "Funcionário com acesso básico"
  }
]
```

### Login com Usuário Admin

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "admin",
    "password": "Admin@123",
    "hostId": "uuid-do-host"
  }'
```

### Usar no Código TypeScript

```typescript
import { RoleType } from './users/enums/role.enum';

// Criar usuário
const createUserDto = {
  name: 'João Silva',
  email: 'joao@example.com',
  username: 'joao',
  password: 'Senha123!',
  role: RoleType.STAFF,  // Usando o enum
  hostId: 'uuid-do-host',
};

// Verificar role
if (user.role === RoleType.ADMIN) {
  // Usuário é admin
}

// Usar no @Roles decorator
@Roles(RoleType.ADMIN, RoleType.MANAGER)
@Get('reports')
getReports() { }
```

## ✅ Benefícios da Mudança

### 1. **Simplicidade**

- ❌ Antes: 2 tabelas (users + roles)
- ✅ Depois: 1 tabela (users com enum)

### 2. **Performance**

- ❌ Antes: JOIN necessário para obter role.name
- ✅ Depois: Valor direto na coluna

### 3. **Type Safety**

```typescript
// ❌ Antes: String sem validação
user.role.name = 'qualquer-coisa';

// ✅ Depois: Enum com validação
user.role = RoleType.ADMIN; // OK
user.role = 'invalido'; // Erro de TypeScript!
```

### 4. **Menos Código**

- Removido RoleEntity, RoleRepository, métodos de busca de roles
- Validação automática pelo enum
- Menos queries ao banco

### 5. **Melhor DX (Developer Experience)**

```typescript
// Autocomplete funcionando
user.role = RoleType. // IDE sugere: ADMIN, MANAGER, RECEPTIONIST, STAFF

// Verificação de tipos
const checkRole = (role: RoleType) => { }
checkRole(user.role);  // OK
checkRole("admin");    // Erro se strictNullChecks=true
```

## 🔄 Migração

Se você já tinha dados no banco antigo:

### Passo 1: Backup

```bash
pg_dump -U karua_user -d karua_crm > backup.sql
```

### Passo 2: Revert Migration Antiga (se houver)

```bash
pnpm run migration:revert
```

### Passo 3: Rodar Nova Migration

```bash
pnpm run migration:run
```

### Passo 4: Verificar Usuário Admin

```bash
docker exec -it karua-postgres psql -U karua_user -d karua_crm

SELECT id, name, username, role FROM users WHERE role = 'admin';
```

## 🎯 Validações

O enum é validado em múltiplas camadas:

### 1. TypeScript (Compile-time)

```typescript
const user: User = {
  role: 'invalid', // ❌ Erro de compilação
};
```

### 2. class-validator (Runtime)

```typescript
@IsEnum(RoleType)
role: RoleType;  // Valida na requisição HTTP
```

### 3. PostgreSQL (Database)

```sql
-- Banco rejeita valores inválidos
INSERT INTO users (role) VALUES ('invalid');
-- ERROR: invalid input value for enum role_type_enum: "invalid"
```

## 📊 Comparação

| Aspecto     | Antes (Entity)       | Depois (Enum) |
| ----------- | -------------------- | ------------- |
| Tabelas     | 2 (users + roles)    | 1 (users)     |
| Queries     | 2 (user + join role) | 1 (user only) |
| Validação   | Manual               | Automática    |
| Type Safety | Parcial              | Total         |
| Performance | Média                | Alta          |
| Código      | ~200 linhas          | ~50 linhas    |
| Manutenção  | Média                | Baixa         |

## 🚨 Breaking Changes

### API

#### ❌ Removidos

- `GET /users/roles/all` → substituído por `GET /users/roles`
- `GET /users/roles/:id` → não é mais necessário

#### ⚠️ Mudados

```typescript
// Antes
POST /users
{
  "roleId": "uuid-do-role"  // ❌
}

// Depois
POST /users
{
  "role": "admin"  // ✅
}
```

### JWT Token

```typescript
// Antes
{
  "role": "admin",
  "roleId": "uuid-do-role"  // ❌ Removido
}

// Depois
{
  "role": "admin"  // ✅ Apenas o enum
}
```

## 🔐 Credenciais Padrão

**⚠️ IMPORTANTE: Alterar após primeiro login!**

```
Email: admin@karua.com
Username: admin
Password: Admin@123
```

Para alterar a senha:

```bash
curl -X PATCH http://localhost:3000/users/{hostId}/{userId}/change-password \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Admin@123",
    "newPassword": "NovaSenhaSegura123!"
  }'
```

## 🎉 Conclusão

A mudança de Role Entity para Enum simplifica significativamente a arquitetura, melhora a performance e proporciona melhor experiência de desenvolvimento com type safety completo.

**Próximos passos:**

1. ✅ Rodar migration: `pnpm run migration:run`
2. ✅ Fazer login com admin
3. ✅ Alterar senha padrão
4. ✅ Criar novos usuários

---

**Data:** 2025-10-10  
**Versão:** 2.0.0

# 🔐 Credenciais do Sistema - Karuá CRM

## ✅ Migration Executada com Sucesso!

A migration foi aplicada e criou:

- ✅ Tabela `users` com enum `role_type_enum`
- ✅ Host padrão: "Hotel Exemplo"
- ✅ Usuário admin automático

---

## 👤 Usuário Admin

### Credenciais de Acesso

```
📧 Email: admin@karua.com
👤 Username: admin
🔑 Password: Admin@123
```

### IDs do Sistema

```
🏨 Host ID: 19fd734c-7008-4c58-a816-bfd4160ca9a8
👤 User ID: 296096b6-890b-4af7-ac4b-9fe4ba9409a4
```

---

## 🚀 Como Fazer Login

### Via cURL

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "admin",
    "password": "Admin@123",
    "hostId": "19fd734c-7008-4c58-a816-bfd4160ca9a8"
  }'
```

### Resposta Esperada

```json
{
  "userId": "296096b6-890b-4af7-ac4b-9fe4ba9409a4",
  "name": "System Admin",
  "email": "admin@karua.com",
  "role": "admin",
  "hostId": "19fd734c-7008-4c58-a816-bfd4160ca9a8",
  "hostName": "Hotel Exemplo"
}
```

### Testar Autenticação

```bash
# Ver dados do usuário logado
curl -X GET http://localhost:3000/auth/me \
  -b cookies.txt

# Listar todos os usuários do host
curl -X GET http://localhost:3000/users/19fd734c-7008-4c58-a816-bfd4160ca9a8 \
  -b cookies.txt
```

---

## 🔒 Alterar Senha (IMPORTANTE!)

⚠️ **Altere a senha padrão imediatamente após o primeiro login!**

```bash
curl -X PATCH http://localhost:3000/users/19fd734c-7008-4c58-a816-bfd4160ca9a8/296096b6-890b-4af7-ac4b-9fe4ba9409a4/change-password \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Admin@123",
    "newPassword": "SuaNovaSenhaSegura123!"
  }'
```

---

## 👥 Criar Novos Usuários

```bash
curl -X POST http://localhost:3000/users \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "username": "joao",
    "password": "Senha123!",
    "role": "staff",
    "hostId": "19fd734c-7008-4c58-a816-bfd4160ca9a8"
  }'
```

### Roles Disponíveis

- `admin` - Administrador (acesso total)
- `manager` - Gerente (gestão e relatórios)
- `receptionist` - Recepcionista (reservas e check-in/out)
- `staff` - Funcionário (acesso básico)

---

## 🗄️ Verificar no Banco de Dados

```bash
# Conectar no PostgreSQL
docker compose exec postgres psql -U karua_user -d karua_crm

# Ver usuários
SELECT id, name, username, email, role, is_active FROM users;

# Ver hosts
SELECT id, name, description FROM hosts;

# Desconectar
\q
```

---

## 📊 Estrutura Criada

### Enum de Roles

```sql
CREATE TYPE role_type_enum AS ENUM ('admin', 'manager', 'receptionist', 'staff');
```

### Tabela Users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role role_type_enum NOT NULL DEFAULT 'staff',
  host_id UUID NOT NULL REFERENCES hosts(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## ⚡ Quick Commands

```bash
# Login
export HOST_ID="19fd734c-7008-4c58-a816-bfd4160ca9a8"
curl -X POST http://localhost:3000/auth/login -c cookies.txt -H "Content-Type: application/json" -d '{"username":"admin","password":"Admin@123","hostId":"'$HOST_ID'"}'

# Ver perfil
curl -X GET http://localhost:3000/auth/me -b cookies.txt

# Listar roles
curl -X GET http://localhost:3000/users/roles

# Logout
curl -X POST http://localhost:3000/auth/logout -b cookies.txt
```

---

## 🔐 Segurança

- ✅ Senha hasheada com bcrypt (10 rounds)
- ✅ JWT em cookies httpOnly
- ✅ Validação em 3 camadas (TypeScript + class-validator + PostgreSQL)
- ✅ Isolamento por host (multi-tenant)
- ✅ Constraints de unicidade (email/username por host)

---

## 📚 Documentação

Para mais informações, consulte:

- `AUTH_QUICKSTART.md` - Guia rápido de autenticação
- `ROLE_ENUM_CHANGES.md` - Detalhes das mudanças de role para enum
- `CHANGELOG_V2.md` - Log completo de mudanças
- `docs/0005-authentication.md` - Documentação completa

---

**Status:** ✅ Sistema pronto para uso!  
**Próximo passo:** Alterar a senha padrão do admin  
**Data:** 2025-10-10


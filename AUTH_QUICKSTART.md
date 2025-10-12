# 🔐 Guia Rápido de Autenticação - Karuá CRM

## 🚀 Início Rápido

### 1. Configurar Banco de Dados

```bash
# Iniciar containers
docker compose up -d postgres redis

# Rodar migrations
pnpm run migration:run
```

**A migration cria automaticamente um usuário admin:**

- **Email:** `admin@karua.com`
- **Username:** `admin`
- **Password:** `Admin@123` ⚠️ **MUDE APÓS PRIMEIRO LOGIN!**

### 2. Fazer Login com Admin

```bash
# Pegue o host_id do banco
docker exec -it karua-postgres psql -U karua_user -d karua_crm -c "SELECT id FROM hosts LIMIT 1"

# Faça login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "admin",
    "password": "Admin@123",
    "hostId": "<uuid-do-host>"
  }'
```

### 3. (Opcional) Criar Outros Usuários

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "username": "joao",
    "password": "Senha123!",
    "role": "staff",
    "hostId": "<uuid-do-host>"
  }'
```

### 4. Acessar Rota Protegida

```bash
curl -X GET http://localhost:3000/auth/me \
  -b cookies.txt
```

## 📝 Endpoints Principais

### Autenticação

| Método | Endpoint        | Descrição       | Auth |
| ------ | --------------- | --------------- | ---- |
| POST   | `/auth/login`   | Fazer login     | ❌   |
| POST   | `/auth/logout`  | Fazer logout    | ✅   |
| GET    | `/auth/me`      | Info do usuário | ✅   |
| POST   | `/auth/refresh` | Renovar token   | ✅   |

### Usuários

| Método | Endpoint                             | Descrição         | Auth | Roles |
| ------ | ------------------------------------ | ----------------- | ---- | ----- |
| POST   | `/users`                             | Criar usuário     | ❌   | -     |
| GET    | `/users/:hostId`                     | Listar usuários   | ✅   | -     |
| GET    | `/users/:hostId/:id`                 | Buscar usuário    | ✅   | -     |
| PATCH  | `/users/:hostId/:id`                 | Atualizar usuário | ✅   | -     |
| PATCH  | `/users/:hostId/:id/change-password` | Alterar senha     | ✅   | -     |
| DELETE | `/users/:hostId/:id`                 | Remover usuário   | ✅   | admin |

### Roles

| Método | Endpoint       | Descrição    | Auth |
| ------ | -------------- | ------------ | ---- |
| GET    | `/users/roles` | Listar roles | ❌   |

## 🛡️ Roles Disponíveis (Enum)

Roles agora são um **enum** para melhor type safety:

```typescript
enum RoleType {
  ADMIN = 'admin', // Acesso total ao sistema
  MANAGER = 'manager', // Acesso a gestão e relatórios
  RECEPTIONIST = 'receptionist', // Acesso a reservas e check-in/out
  STAFF = 'staff', // Acesso básico
}
```

**Valores válidos:** `admin`, `manager`, `receptionist`, `staff`

## 💻 Exemplos de Código

### Frontend com Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // IMPORTANTE!
});

// Login
const login = async () => {
  const { data } = await api.post('/auth/login', {
    username: 'admin',
    password: 'Admin123!',
    hostId: 'uuid-do-host',
  });
  console.log('Usuário logado:', data);
};

// Buscar perfil
const getProfile = async () => {
  const { data } = await api.get('/auth/me');
  console.log('Perfil:', data);
};

// Logout
const logout = async () => {
  await api.post('/auth/logout');
  console.log('Logout realizado');
};
```

### Backend NestJS - Proteger Rotas

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { Public } from './auth/decorators/public.decorator';

@Controller('example')
export class ExampleController {
  // Rota PÚBLICA (não requer auth)
  @Public()
  @Get('public')
  getPublic() {
    return 'Conteúdo público';
  }

  // Rota AUTENTICADA (requer login)
  @UseGuards(JwtAuthGuard)
  @Get('private')
  getPrivate(@CurrentUser() user: any) {
    return `Olá ${user.username}!`;
  }

  // Rota AUTORIZADA (requer role específico)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Post('admin-only')
  adminOnly(@CurrentUser('userId') userId: string) {
    return `Action by ${userId}`;
  }
}
```

## 🔑 Variáveis de Ambiente

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=karua_crm
DB_USERNAME=karua_user
DB_PASSWORD=karua_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h

# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001
```

## 🔒 Segurança dos Cookies

Os tokens JWT são armazenados em cookies **httpOnly**, o que significa:

✅ **Protegido contra XSS** - JavaScript não pode acessar o cookie  
✅ **Protegido contra CSRF** - SameSite='strict'  
✅ **Apenas HTTPS em produção** - secure=true  
✅ **Expira automaticamente** - maxAge=1h

## 📚 Documentação Completa

Para mais detalhes, veja:

- `docs/0005-authentication.md` - Documentação completa
- `docs/0003-database-schema.md` - Schema do banco de dados
- `http://localhost:3000/docs` - Documentação Swagger da API

## 🐛 Troubleshooting

### ❌ Cookies não funcionam

**Problema:** Frontend não recebe/envia cookies

**Solução:**

```javascript
// Configure o axios/fetch com:
withCredentials: true; // axios
credentials: 'include'; // fetch
```

### ❌ CORS Error

**Problema:** Erro de CORS no navegador

**Solução:** Configure `FRONTEND_URL` no `.env`

### ❌ Token expirado

**Problema:** 401 Unauthorized após 1 hora

**Solução:** Use o endpoint `/auth/refresh` para renovar o token

### ❌ Role não autorizado

**Problema:** 403 Forbidden

**Solução:** Verifique se o usuário tem o role correto:

```bash
# Buscar info do usuário
curl -X GET http://localhost:3000/auth/me -b cookies.txt
```

## 🧪 Testar com cURL

```bash
# 1. Login e salvar cookies
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username":"admin","password":"Admin123!","hostId":"uuid"}'

# 2. Acessar rota protegida
curl -X GET http://localhost:3000/auth/me \
  -b cookies.txt

# 3. Renovar token
curl -X POST http://localhost:3000/auth/refresh \
  -b cookies.txt \
  -c cookies.txt

# 4. Logout
curl -X POST http://localhost:3000/auth/logout \
  -b cookies.txt
```

## 🎯 Próximos Passos

1. ✅ Criar primeiro usuário admin
2. ✅ Fazer login
3. ✅ Testar rotas protegidas
4. ✅ Integrar com frontend
5. 🔜 Implementar recuperação de senha
6. 🔜 Adicionar 2FA (autenticação de dois fatores)
7. 🔜 Implementar rate limiting

---

**Dúvidas?** Consulte a documentação completa em `docs/0005-authentication.md`

# Autenticação e Autorização - Karuá CRM

Este documento descreve a implementação de autenticação e autorização do sistema Karuá CRM.

## Visão Geral

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação, implementado com **Passport.js** e **NestJS**. Os tokens são transmitidos via **cookies httpOnly** para maior segurança, dificultando ataques XSS no lado do cliente.

## Tecnologias Utilizadas

- **@nestjs/jwt**: Geração e validação de tokens JWT
- **@nestjs/passport**: Integração com Passport.js
- **passport-jwt**: Estratégia JWT para Passport
- **bcrypt**: Hash de senhas
- **cookie-parser**: Parse de cookies

## Estrutura de Módulos

### Users Module

Responsável pelo gerenciamento de usuários e roles:

```
src/users/
├── dto/
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   └── change-password.dto.ts
├── entities/
│   ├── user.entity.ts
│   └── role.entity.ts
├── users.controller.ts
├── users.service.ts
└── users.module.ts
```

#### Endpoints Users

- `POST /users` - Criar usuário
- `GET /users/:hostId` - Listar usuários de um host
- `GET /users/:hostId/:id` - Buscar usuário por ID
- `PATCH /users/:hostId/:id` - Atualizar usuário
- `PATCH /users/:hostId/:id/change-password` - Alterar senha
- `PATCH /users/:hostId/:id/deactivate` - Desativar usuário
- `PATCH /users/:hostId/:id/activate` - Ativar usuário
- `DELETE /users/:hostId/:id` - Remover usuário
- `GET /users/roles/all` - Listar todos os roles
- `GET /users/roles/:id` - Buscar role por ID

### Auth Module

Responsável pela autenticação e autorização:

```
src/auth/
├── decorators/
│   ├── current-user.decorator.ts    # Extrair usuário autenticado
│   ├── public.decorator.ts          # Marcar rotas públicas
│   └── roles.decorator.ts           # Definir roles necessários
├── dto/
│   ├── login.dto.ts
│   └── auth-response.dto.ts
├── guards/
│   ├── jwt-auth.guard.ts            # Guard de autenticação JWT
│   └── roles.guard.ts               # Guard de autorização por roles
├── interfaces/
│   └── jwt-payload.interface.ts
├── strategies/
│   └── jwt.strategy.ts              # Estratégia JWT do Passport
├── auth.controller.ts
├── auth.service.ts
└── auth.module.ts
```

#### Endpoints Auth

- `POST /auth/login` - Realizar login
- `POST /auth/logout` - Realizar logout
- `GET /auth/me` - Obter informações do usuário autenticado
- `POST /auth/refresh` - Renovar token de acesso

## Segurança dos Cookies

Os tokens JWT são armazenados em **cookies httpOnly** com as seguintes configurações:

```typescript
response.cookie('access_token', accessToken, {
  httpOnly: true, // Não acessível via JavaScript
  secure: true, // Apenas HTTPS em produção
  sameSite: 'strict', // Proteção contra CSRF
  maxAge: 60 * 60 * 1000, // 1 hora
});
```

### Benefícios

- **httpOnly**: O cookie não pode ser acessado via JavaScript, protegendo contra ataques XSS
- **secure**: Em produção, o cookie só é enviado via HTTPS
- **sameSite**: Proteção contra ataques CSRF
- **maxAge**: Tempo de expiração do cookie

## Fluxo de Autenticação

### 1. Login

```bash
POST /auth/login
Content-Type: application/json

{
  "username": "joaosilva",
  "password": "SenhaForte123!",
  "hostId": "uuid-do-host"
}
```

**Resposta:**

```json
{
  "userId": "uuid-user-id",
  "name": "João Silva",
  "email": "joao.silva@example.com",
  "role": "admin",
  "hostId": "uuid-host-id",
  "hostName": "Hotel Exemplo"
}
```

O token JWT é automaticamente armazenado no cookie `access_token`.

### 2. Acessar Rotas Protegidas

Todas as requisições subsequentes enviarão automaticamente o cookie `access_token`:

```bash
GET /auth/me
Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Logout

```bash
POST /auth/logout
```

Isso limpa o cookie `access_token`.

### 4. Refresh Token

```bash
POST /auth/refresh
Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Gera um novo token JWT e atualiza o cookie.

## Estrutura do JWT Payload

```typescript
{
  sub: "uuid-user-id",        // ID do usuário
  email: "user@example.com",
  username: "joaosilva",
  role: "admin",
  roleId: "uuid-role-id",
  hostId: "uuid-host-id",
  iat: 1234567890,            // Issued at
  exp: 1234571490             // Expiration
}
```

## Guards e Decorators

### JwtAuthGuard

Guard global para proteger rotas que requerem autenticação:

```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
getProtectedResource() {
  return 'Conteúdo protegido';
}
```

### RolesGuard

Guard para autorização baseada em roles:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@Get('admin-only')
getAdminResource() {
  return 'Apenas admins e gerentes';
}
```

### @Public()

Decorator para marcar rotas públicas (não requerem autenticação):

```typescript
@Public()
@Get('public')
getPublicResource() {
  return 'Conteúdo público';
}
```

### @CurrentUser()

Decorator para extrair informações do usuário autenticado:

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user: any) {
  console.log(user.userId, user.email, user.role);
  return user;
}

// Ou extrair apenas um campo específico:
@Get('email')
getEmail(@CurrentUser('email') email: string) {
  return { email };
}
```

## Roles Padrão

O sistema possui 4 roles pré-configurados:

1. **admin**: Administrador do sistema com acesso total
2. **manager**: Gerente com acesso a gestão e relatórios
3. **receptionist**: Recepcionista com acesso a reservas e check-in/out
4. **staff**: Funcionário com acesso básico

## Isolamento por Host

Cada usuário está vinculado a um **host** (hotel/pousada). O sistema garante isolamento completo:

- Usuários de um host não podem acessar dados de outro host
- Cada host possui seus próprios usuários
- Email e username são únicos por host (podem existir em múltiplos hosts)

## Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://seu-frontend.com
```

## Integração com Frontend

### Configuração CORS

O backend está configurado para aceitar credenciais (cookies):

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

### Cliente (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Importante: enviar cookies
});

// Login
const login = async (username, password, hostId) => {
  const response = await api.post('/auth/login', {
    username,
    password,
    hostId,
  });
  return response.data;
};

// Requisição autenticada
const getProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Logout
const logout = async () => {
  await api.post('/auth/logout');
};
```

### Cliente (Fetch)

```javascript
// Login
const login = async (username, password, hostId) => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Importante: enviar cookies
    body: JSON.stringify({ username, password, hostId }),
  });
  return response.json();
};

// Requisição autenticada
const getProfile = async () => {
  const response = await fetch('http://localhost:3000/auth/me', {
    credentials: 'include',
  });
  return response.json();
};
```

## Boas Práticas de Segurança

1. **Senhas**: Sempre use senhas fortes (mínimo 6 caracteres, recomendado 12+)
2. **JWT_SECRET**: Use uma chave longa e aleatória em produção
3. **HTTPS**: Sempre use HTTPS em produção
4. **Rotação de Senhas**: Implemente política de rotação de senhas
5. **2FA**: Considere implementar autenticação de dois fatores (futuro)
6. **Rate Limiting**: Implemente rate limiting para prevenir brute force
7. **Logs de Auditoria**: Registre todas as tentativas de login e alterações de senha

## Exemplo de Uso Completo

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { Public } from './auth/decorators/public.decorator';

@Controller('bookings')
export class BookingsController {
  // Rota pública
  @Public()
  @Get('available')
  getAvailableRooms() {
    return 'Lista de quartos disponíveis';
  }

  // Rota autenticada
  @UseGuards(JwtAuthGuard)
  @Get('my-bookings')
  getMyBookings(@CurrentUser('userId') userId: string) {
    return `Reservas do usuário ${userId}`;
  }

  // Rota com autorização por role
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @Get('all')
  getAllBookings(@CurrentUser() user: any) {
    return `Todas as reservas do host ${user.hostId}`;
  }

  // Apenas admins
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  deleteBooking(@CurrentUser() user: any) {
    return `Reserva deletada por admin ${user.email}`;
  }
}
```

## Troubleshooting

### Cookies não estão sendo enviados

Verifique:

- `withCredentials: true` no cliente
- `credentials: 'include'` no fetch
- CORS configurado com `credentials: true`
- Domínio e porta corretos

### Token expirado

- O token JWT expira após 1 hora por padrão
- Use o endpoint `/auth/refresh` para renovar
- Implemente lógica de refresh automático no frontend

### Usuário não autorizado

- Verifique se o usuário tem o role adequado
- Confirme que os decorators `@Roles()` estão corretos
- Verifique se `RolesGuard` está sendo usado

## Próximas Melhorias

- [ ] Implementar refresh tokens em banco de dados
- [ ] Adicionar autenticação de dois fatores (2FA)
- [ ] Implementar recuperação de senha por email
- [ ] Adicionar rate limiting para prevenir brute force
- [ ] Implementar blacklist de tokens revogados
- [ ] Adicionar logs de auditoria de segurança
- [ ] Implementar política de complexidade de senha

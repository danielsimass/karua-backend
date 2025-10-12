# Uso do Guard Global de Autenticação

## Visão Geral

A aplicação está configurada com autenticação global usando o `JwtAuthGuard`. Isso significa que **todos os endpoints são protegidos por padrão** e requerem autenticação.

Para marcar endpoints como públicos (sem necessidade de autenticação), use o decorator `@Public()`.

## Configuração

O `JwtAuthGuard` foi registrado globalmente no `AppModule`:

```typescript
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

## Como Usar

### Endpoints Protegidos (Padrão)

Por padrão, todos os endpoints requerem autenticação. Você não precisa fazer nada:

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('customers')
export class CustomersController {
  @Get()
  findAll() {
    // Este endpoint REQUER autenticação
    return [];
  }
}
```

### Endpoints Públicos

Para marcar um endpoint como público, use o decorator `@Public()`:

```typescript
import { Controller, Get, Post } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller('customers')
export class CustomersController {
  @Public()
  @Get('public')
  findPublic() {
    // Este endpoint NÃO requer autenticação
    return [];
  }

  @Get('private')
  findPrivate() {
    // Este endpoint REQUER autenticação
    return [];
  }
}
```

### Usar com o Decorator @HostId

O decorator `@HostId()` extrai automaticamente o `hostId` do usuário autenticado:

```typescript
import { Controller, Get } from '@nestjs/common';
import { HostId } from './auth/decorators/host-id.decorator';

@Controller('customers')
export class CustomersController {
  @Get()
  findAll(@HostId() hostId: string) {
    // hostId está disponível aqui
    console.log('Host ID:', hostId);
    return this.service.findByHostId(hostId);
  }
}
```

### Usar com o Decorator @CurrentUser

Para acessar o usuário completo:

```typescript
import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Controller('profile')
export class ProfileController {
  @Get()
  getProfile(@CurrentUser() user: any) {
    // user contém: { userId, hostId, email, role, ... }
    return user;
  }

  @Get('email')
  getEmail(@CurrentUser('email') email: string) {
    // Extrai apenas o email
    return { email };
  }
}
```

## Endpoints Públicos na Aplicação

Os seguintes endpoints estão marcados como públicos:

- `GET /` - Health check / Welcome
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout

Todos os outros endpoints requerem autenticação.

## Decorators Disponíveis

| Decorator               | Descrição                                        | Exemplo                       |
| ----------------------- | ------------------------------------------------ | ----------------------------- |
| `@Public()`             | Marca um endpoint como público (não requer auth) | `@Public()`                   |
| `@CurrentUser()`        | Extrai o usuário completo da requisição          | `@CurrentUser() user`         |
| `@CurrentUser('campo')` | Extrai um campo específico do usuário            | `@CurrentUser('email') email` |
| `@HostId()`             | Extrai o hostId do usuário                       | `@HostId() hostId`            |
| `@Roles(...)`           | Define roles permitidas para o endpoint          | `@Roles('admin', 'manager')`  |

## Importante

- **NÃO é necessário** usar `@UseGuards(JwtAuthGuard)` nos endpoints, pois o guard já está global
- Use `@Public()` **apenas** em endpoints que devem ser acessíveis sem autenticação
- O decorator `@HostId()` lança um erro se o usuário não estiver autenticado ou não tiver hostId

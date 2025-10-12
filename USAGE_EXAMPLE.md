# 📘 Exemplo de Uso - Autenticação em Controllers

Este documento demonstra como proteger rotas nos controllers do Karuá CRM.

## 🔒 Exemplo: Customers Controller

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplicar guards globalmente no controller
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // Criar cliente - Requer autenticação (qualquer role)
  @Post()
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @CurrentUser('hostId') hostId: string,
    @CurrentUser('userId') userId: string
  ) {
    console.log(`Cliente criado por usuário ${userId} do host ${hostId}`);
    return this.customersService.create(createCustomerDto);
  }

  // Listar clientes - Requer autenticação
  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes do host' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  findAll(@CurrentUser('hostId') hostId: string) {
    return this.customersService.findAll(hostId);
  }

  // Buscar cliente - Requer autenticação
  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('hostId') hostId: string) {
    return this.customersService.findOne(id, hostId);
  }

  // Atualizar cliente - Requer autenticação (manager ou admin)
  @Patch(':id')
  @Roles('admin', 'manager', 'receptionist')
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @CurrentUser('hostId') hostId: string
  ) {
    return this.customersService.update(id, hostId, updateCustomerDto);
  }

  // Deletar cliente - APENAS ADMIN
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover cliente (apenas admin)' })
  @ApiResponse({ status: 204, description: 'Cliente removido' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('hostId') hostId: string,
    @CurrentUser() user: any
  ) {
    console.log(`Cliente ${id} removido por admin ${user.email}`);
    return this.customersService.remove(id, hostId);
  }

  // Rota pública - Buscar por CPF/Email (para check-in rápido)
  @Public()
  @Get('search/:document')
  @ApiOperation({ summary: 'Buscar cliente por documento (público)' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  searchByDocument(@Param('document') document: string) {
    return this.customersService.findByDocument(document);
  }
}
```

## 🎯 Padrões de Uso

### 1. Guards Globais no Controller

Aplique os guards no nível do controller:

```typescript
@Controller('resource')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ResourceController {}
```

### 2. Rotas Públicas Específicas

Use `@Public()` para rotas que não precisam de autenticação:

```typescript
@Public()
@Get('public-endpoint')
publicEndpoint() { }
```

### 3. Autorização por Role

Use `@Roles()` para restringir acesso:

```typescript
@Roles('admin', 'manager')
@Delete(':id')
deleteItem() { }
```

### 4. Extrair Dados do Usuário

Use `@CurrentUser()` para acessar dados do usuário autenticado:

```typescript
// Objeto completo
@Get('profile')
getProfile(@CurrentUser() user: any) {
  console.log(user.userId, user.email, user.role, user.hostId);
}

// Campo específico
@Get('my-data')
getData(@CurrentUser('userId') userId: string) {
  return this.service.findByUser(userId);
}
```

## 🔐 Níveis de Segurança

### Nível 1: Rota Pública

```typescript
@Public()
@Get('info')
getInfo() {
  return { message: 'Informação pública' };
}
```

### Nível 2: Requer Autenticação (Qualquer Role)

```typescript
@UseGuards(JwtAuthGuard)
@Get('private')
getPrivate(@CurrentUser() user: any) {
  return { message: `Olá ${user.username}` };
}
```

### Nível 3: Requer Role Específico

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@Get('reports')
getReports(@CurrentUser('hostId') hostId: string) {
  return this.service.generateReports(hostId);
}
```

### Nível 4: Apenas Admin

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete('danger/:id')
dangerousOperation(@CurrentUser() user: any) {
  this.logger.warn(`Operação perigosa por ${user.email}`);
  return this.service.delete();
}
```

## 📊 Exemplo Completo: Bookings Controller

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  // Público - Ver disponibilidade
  @Public()
  @Get('availability')
  getAvailability() {
    return this.bookingsService.getAvailableRooms();
  }

  // Autenticado - Criar reserva
  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser('userId') userId: string,
    @CurrentUser('hostId') hostId: string
  ) {
    return this.bookingsService.create({
      ...createBookingDto,
      userId,
      hostId,
    });
  }

  // Autenticado - Ver minhas reservas
  @Get('my-bookings')
  getMyBookings(@CurrentUser('userId') userId: string) {
    return this.bookingsService.findByUser(userId);
  }

  // Manager/Admin - Ver todas as reservas
  @Roles('admin', 'manager')
  @Get('all')
  getAllBookings(@CurrentUser('hostId') hostId: string) {
    return this.bookingsService.findAll(hostId);
  }

  // Receptionist+ - Check-in
  @Roles('admin', 'manager', 'receptionist')
  @Post(':id/check-in')
  checkIn(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.checkIn(id, user.userId);
  }

  // Admin - Cancelar qualquer reserva
  @Roles('admin')
  @Delete(':id')
  cancel(@Param('id') id: string, @CurrentUser('email') adminEmail: string) {
    this.logger.log(`Reserva ${id} cancelada por ${adminEmail}`);
    return this.bookingsService.cancel(id);
  }
}
```

## 🛡️ Boas Práticas

### 1. Sempre Valide o Host

```typescript
@Get(':id')
findOne(
  @Param('id') id: string,
  @CurrentUser('hostId') hostId: string,
) {
  // Sempre passe o hostId para garantir isolamento
  return this.service.findOne(id, hostId);
}
```

### 2. Use Roles de Forma Incremental

```typescript
// ❌ Ruim - muito específico
@Roles('admin')
@Get('reports')

// ✅ Bom - permite múltiplos roles
@Roles('admin', 'manager')
@Get('reports')
```

### 3. Log Operações Sensíveis

```typescript
@Roles('admin')
@Delete(':id')
remove(@Param('id') id: string, @CurrentUser() user: any) {
  this.logger.warn(`DELETE by ${user.email} - Resource ${id}`);
  return this.service.remove(id);
}
```

### 4. Extraia Apenas o Necessário

```typescript
// ❌ Desnecessário
@Get('items')
getItems(@CurrentUser() user: any) {
  return this.service.findAll(user.hostId);
}

// ✅ Melhor
@Get('items')
getItems(@CurrentUser('hostId') hostId: string) {
  return this.service.findAll(hostId);
}
```

## 🔍 Debugging

### Ver o que está no Token

```typescript
@Get('debug')
debug(@CurrentUser() user: any) {
  return {
    userId: user.userId,
    email: user.email,
    username: user.username,
    role: user.role,
    roleId: user.roleId,
    hostId: user.hostId,
  };
}
```

### Testar Autorização

```bash
# Login como admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c admin-cookies.txt \
  -d '{"username":"admin","password":"Admin123!","hostId":"..."}'

# Login como staff
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -c staff-cookies.txt \
  -d '{"username":"staff","password":"Staff123!","hostId":"..."}'

# Tentar acessar rota admin como staff (deve falhar)
curl -X DELETE http://localhost:3000/resource/123 \
  -b staff-cookies.txt

# Acessar como admin (deve funcionar)
curl -X DELETE http://localhost:3000/resource/123 \
  -b admin-cookies.txt
```

## 🎨 Estrutura Recomendada

```typescript
@Controller('resource')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('resource')
export class ResourceController {
  // 1. Rotas públicas primeiro
  @Public()
  @Get('public')
  publicRoute() {}

  // 2. Rotas autenticadas (qualquer role)
  @Get()
  list(@CurrentUser('hostId') hostId: string) {}

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('hostId') hostId: string) {}

  @Post()
  create(@Body() dto: CreateDto, @CurrentUser() user: any) {}

  // 3. Rotas com roles específicos
  @Roles('admin', 'manager')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDto) {}

  // 4. Rotas admin por último
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {}
}
```

---

**Dica:** Sempre teste suas rotas com diferentes roles para garantir que a autorização está funcionando corretamente!

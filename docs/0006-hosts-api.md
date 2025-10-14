# API de Hosts

## Criar Host com Representante Legal

### Endpoint

`POST /hosts`

### Autenticação

- Requer JWT token (Bearer authentication)
- Requer role: `ADMIN`

### Descrição

Cria um novo host junto com seu representante legal em uma única transação. Se ocorrer qualquer erro durante a criação, tanto o host quanto o representante legal não serão criados (rollback automático).

### Request Body

```json
{
  "name": "Hotel Paradise",
  "description": "Hotel de luxo com vista para o mar",
  "cnpj": "12345678000190",
  "cep": "12345678",
  "street": "Av. Atlântica",
  "number": "1234",
  "state": "RJ",
  "phone": "2133334444",
  "email": "contato@hotelparadise.com",
  "isActive": true,
  "legalRepresentative": {
    "name": "João Silva",
    "email": "joao.silva@example.com",
    "cpf": "12345678901",
    "phone": "11987654321"
  }
}
```

### Campos

#### Host

| Campo       | Tipo    | Obrigatório | Descrição                                       |
| ----------- | ------- | ----------- | ----------------------------------------------- |
| name        | string  | Sim         | Nome do host (1-255 caracteres)                 |
| description | string  | Não         | Descrição do host                               |
| cnpj        | string  | Não         | CNPJ do host (14-18 caracteres, apenas números) |
| cep         | string  | Não         | CEP do endereço (8-10 caracteres)               |
| street      | string  | Não         | Rua do endereço (1-255 caracteres)              |
| number      | string  | Não         | Número do endereço (1-20 caracteres)            |
| state       | string  | Não         | Estado/UF (2 caracteres)                        |
| phone       | string  | Não         | Telefone do host (1-20 caracteres)              |
| email       | string  | Não         | Email do host (1-255 caracteres)                |
| isActive    | boolean | Não         | Indicador se o host está ativo (padrão: true)   |

#### Representante Legal

| Campo | Tipo   | Obrigatório | Descrição                                         |
| ----- | ------ | ----------- | ------------------------------------------------- |
| name  | string | Sim         | Nome do representante legal (1-255 caracteres)    |
| email | string | Sim         | Email do representante legal (1-255 caracteres)   |
| cpf   | string | Sim         | CPF do representante legal (11-14 caracteres)     |
| phone | string | Não         | Telefone do representante legal (1-20 caracteres) |

### Respostas

#### 201 Created

```json
{
  "id": "uuid-do-host",
  "name": "Hotel Paradise",
  "description": "Hotel de luxo com vista para o mar",
  "cnpj": "12345678000190",
  "cep": "12345678",
  "street": "Av. Atlântica",
  "number": "1234",
  "state": "RJ",
  "phone": "2133334444",
  "email": "contato@hotelparadise.com",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "legalRepresentatives": [
    {
      "id": "uuid-do-representante",
      "name": "João Silva",
      "email": "joao.silva@example.com",
      "cpf": "12345678901",
      "phone": "11987654321",
      "hostId": "uuid-do-host",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 401 Unauthorized

Retornado quando o token JWT não é fornecido ou é inválido.

```json
{
  "statusCode": 401,
  "message": "Não autenticado"
}
```

#### 403 Forbidden

Retornado quando o usuário autenticado não tem role de ADMIN.

```json
{
  "statusCode": 403,
  "message": "Você não tem permissão para acessar este recurso"
}
```

#### 409 Conflict

Retornado quando já existe um host com o mesmo CNPJ ou um representante legal com o mesmo CPF.

```json
{
  "statusCode": 409,
  "message": "Já existe um host cadastrado com este CNPJ"
}
```

ou

```json
{
  "statusCode": 409,
  "message": "Já existe um representante legal cadastrado com este CPF"
}
```

#### 400 Bad Request

Retornado quando há erros de validação nos dados enviados.

```json
{
  "statusCode": 400,
  "message": ["Nome é obrigatório", "Email inválido", "CPF deve ter entre 11 e 14 caracteres"],
  "error": "Bad Request"
}
```

### Exemplo de uso com cURL

```bash
# 1. Primeiro, faça login para obter o token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "senha123"
  }'

# 2. Use o token retornado para criar o host
curl -X POST http://localhost:3000/hosts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Hotel Paradise",
    "description": "Hotel de luxo com vista para o mar",
    "cnpj": "12345678000190",
    "cep": "12345678",
    "street": "Av. Atlântica",
    "number": "1234",
    "state": "RJ",
    "phone": "2133334444",
    "email": "contato@hotelparadise.com",
    "isActive": true,
    "legalRepresentative": {
      "name": "João Silva",
      "email": "joao.silva@example.com",
      "cpf": "12345678901",
      "phone": "11987654321"
    }
  }'
```

### Observações

1. **Transação Atômica**: A criação do host e do representante legal acontece em uma única transação. Se qualquer parte falhar, ambas as operações são revertidas.

2. **Validação de CNPJ**: Se o CNPJ for fornecido, o sistema verifica se já existe outro host cadastrado com o mesmo CNPJ.

3. **Validação de CPF**: O sistema sempre verifica se já existe um representante legal cadastrado com o mesmo CPF.

4. **Relacionamento**: O representante legal é automaticamente associado ao host criado através do campo `hostId`.

5. **Campo isActive**: Se não for fornecido, o padrão é `true`.

6. **Documentação Swagger**: O endpoint também está documentado no Swagger, acessível em `/api` quando o servidor está rodando.

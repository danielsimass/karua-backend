# Common Utils e Validators

Este módulo contém utilitários e validadores compartilhados em toda a aplicação.

## Document Validator

Utilitários para validação de documentos brasileiros (CPF e CNPJ).

### Localização

- **Utils**: `src/common/utils/document-validator.util.ts`
- **Validators**: `src/common/validators/`

### Funções Disponíveis

#### `isValidCPF(cpf: string): boolean`

Valida se um CPF é válido, aceitando com ou sem máscara.

```typescript
import { isValidCPF } from '@/common/utils/document-validator.util';

isValidCPF('12345678909'); // true
isValidCPF('123.456.789-09'); // true
isValidCPF('11111111111'); // false (todos dígitos iguais)
isValidCPF('12345678900'); // false (dígito verificador inválido)
```

#### `isValidCNPJ(cnpj: string): boolean`

Valida se um CNPJ é válido, aceitando com ou sem máscara.

```typescript
import { isValidCNPJ } from '@/common/utils/document-validator.util';

isValidCNPJ('11222333000181'); // true
isValidCNPJ('11.222.333/0001-81'); // true
isValidCNPJ('11111111111111'); // false (todos dígitos iguais)
isValidCNPJ('11222333000180'); // false (dígito verificador inválido)
```

#### `cleanDocument(document: string): string`

Remove todos os caracteres não numéricos de um documento.

```typescript
import { cleanDocument } from '@/common/utils/document-validator.util';

cleanDocument('123.456.789-09'); // '12345678909'
cleanDocument('11.222.333/0001-81'); // '11222333000181'
cleanDocument('abc123def456'); // '123456'
```

#### `formatCPF(cpf: string): string`

Formata um CPF adicionando a máscara (xxx.xxx.xxx-xx).

```typescript
import { formatCPF } from '@/common/utils/document-validator.util';

formatCPF('12345678909'); // '123.456.789-09'
formatCPF('123.456.789-09'); // '123.456.789-09'
```

#### `formatCNPJ(cnpj: string): string`

Formata um CNPJ adicionando a máscara (xx.xxx.xxx/xxxx-xx).

```typescript
import { formatCNPJ } from '@/common/utils/document-validator.util';

formatCNPJ('11222333000181'); // '11.222.333/0001-81'
formatCNPJ('11.222.333/0001-81'); // '11.222.333/0001-81'
```

### Decorators para Class Validator

#### `@IsValidCPF()`

Decorator para validar CPF em DTOs usando `class-validator`.

```typescript
import { IsValidCPF } from '@/common/validators';

export class CreateUserDto {
  @IsValidCPF({ message: 'CPF inválido' })
  cpf: string;
}
```

#### `@IsValidCNPJ()`

Decorator para validar CNPJ em DTOs usando `class-validator`.

```typescript
import { IsValidCNPJ } from '@/common/validators';

export class CreateCompanyDto {
  @IsValidCNPJ({ message: 'CNPJ inválido' })
  cnpj: string;
}
```

### Exemplo Completo em DTO

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { IsValidCPF, IsValidCNPJ } from '@/common/validators';

export class CreateLegalRepresentativeDto {
  @ApiProperty({
    description: 'CPF do representante (com ou sem máscara)',
    example: '12345678909',
  })
  @IsNotEmpty()
  @IsString()
  @IsValidCPF({ message: 'CPF inválido' })
  cpf: string;
}

export class CreateHostDto {
  @ApiProperty({
    description: 'CNPJ da empresa (com ou sem máscara)',
    example: '11222333000181',
    required: false,
  })
  @IsString()
  @IsValidCNPJ({ message: 'CNPJ inválido' })
  cnpj?: string;
}
```

### Testes

Os testes unitários estão disponíveis em `src/common/utils/document-validator.util.spec.ts`.

Execute os testes com:

```bash
npm test document-validator.util.spec
```

### Algoritmo de Validação

#### CPF

- Deve ter 11 dígitos
- Não pode ter todos os dígitos iguais
- Valida os dois dígitos verificadores usando o algoritmo oficial da Receita Federal

#### CNPJ

- Deve ter 14 dígitos
- Não pode ter todos os dígitos iguais
- Valida os dois dígitos verificadores usando o algoritmo oficial da Receita Federal

### Observações

- Ambas as funções aceitam documentos com ou sem máscara
- A validação é feita nos dígitos verificadores, não apenas no formato
- CPFs/CNPJs com todos os dígitos iguais são considerados inválidos
- Valores vazios, null ou undefined retornam `false`

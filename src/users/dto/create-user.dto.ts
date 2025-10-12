import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do usuário' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @ApiProperty({ example: 'joao.silva@example.com', description: 'Email do usuário' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'joaosilva', description: 'Nome de usuário único' })
  @IsNotEmpty({ message: 'Username é obrigatório' })
  @IsString({ message: 'Username deve ser uma string' })
  username: string;

  @ApiProperty({ example: 'SenhaForte123!', description: 'Senha do usuário' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'staff',
    description: 'Role do usuário',
    enum: RoleType,
  })
  @IsNotEmpty({ message: 'Role é obrigatório' })
  @IsEnum(RoleType, {
    message: 'Role deve ser um valor válido: admin, manager, receptionist, staff',
  })
  role: RoleType;

  @ApiProperty({ example: 'uuid-host-id', description: 'ID do host (hotel/pousada)' })
  @IsNotEmpty({ message: 'Host é obrigatório' })
  @IsUUID('4', { message: 'Host ID deve ser um UUID válido' })
  hostId: string;
}

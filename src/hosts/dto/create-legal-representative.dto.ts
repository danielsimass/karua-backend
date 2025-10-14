import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';
import { IsValidCPF } from '../../common';

export class CreateLegalRepresentativeDto {
  @ApiProperty({
    description: 'Nome do representante legal',
    example: 'João Silva',
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(1, 255, { message: 'Nome deve ter entre 1 e 255 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Email do representante legal',
    example: 'joao.silva@example.com',
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  @Length(1, 255, { message: 'Email deve ter entre 1 e 255 caracteres' })
  email: string;

  @ApiProperty({
    description: 'CPF do representante legal (apenas números ou com máscara)',
    example: '12345678909',
  })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString({ message: 'CPF deve ser uma string' })
  @Length(11, 14, { message: 'CPF deve ter entre 11 e 14 caracteres' })
  @IsValidCPF({ message: 'CPF inválido' })
  cpf: string;

  @ApiProperty({
    description: 'Telefone do representante legal',
    example: '11987654321',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  @Length(1, 20, { message: 'Telefone deve ter entre 1 e 20 caracteres' })
  phone?: string;
}

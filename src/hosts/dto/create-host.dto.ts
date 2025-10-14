import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidCNPJ } from '../../common';
import { CreateLegalRepresentativeDto } from './create-legal-representative.dto';

export class CreateHostDto {
  @ApiProperty({
    description: 'Nome do host',
    example: 'Hotel Paradise',
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(1, 255, { message: 'Nome deve ter entre 1 e 255 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descrição do host',
    example: 'Hotel de luxo com vista para o mar',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'CNPJ do host (apenas números ou com máscara)',
    example: '11222333000181',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'CNPJ deve ser uma string' })
  @Length(14, 18, { message: 'CNPJ deve ter entre 14 e 18 caracteres' })
  @IsValidCNPJ({ message: 'CNPJ inválido' })
  cnpj?: string;

  @ApiProperty({
    description: 'CEP do endereço',
    example: '12345678',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'CEP deve ser uma string' })
  @Length(8, 10, { message: 'CEP deve ter entre 8 e 10 caracteres' })
  cep?: string;

  @ApiProperty({
    description: 'Rua do endereço',
    example: 'Av. Atlântica',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Rua deve ser uma string' })
  @Length(1, 255, { message: 'Rua deve ter entre 1 e 255 caracteres' })
  street?: string;

  @ApiProperty({
    description: 'Número do endereço',
    example: '1234',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Número deve ser uma string' })
  @Length(1, 20, { message: 'Número deve ter entre 1 e 20 caracteres' })
  number?: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'RJ',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Estado deve ser uma string' })
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres' })
  state?: string;

  @ApiProperty({
    description: 'Telefone do host',
    example: '2133334444',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  @Length(1, 20, { message: 'Telefone deve ter entre 1 e 20 caracteres' })
  phone?: string;

  @ApiProperty({
    description: 'Email do host',
    example: 'contato@hotelparadise.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @Length(1, 255, { message: 'Email deve ter entre 1 e 255 caracteres' })
  email?: string;

  @ApiProperty({
    description: 'Indicador se o host está ativo',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um booleano' })
  isActive?: boolean;

  @ApiProperty({
    description: 'Dados do representante legal',
    type: CreateLegalRepresentativeDto,
  })
  @IsNotEmpty({ message: 'Dados do representante legal são obrigatórios' })
  @ValidateNested()
  @Type(() => CreateLegalRepresentativeDto)
  legalRepresentative: CreateLegalRepresentativeDto;
}

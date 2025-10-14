import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateLegalRepresentativeDto } from './update-legal-representative.dto';

export class UpdateHostDto {
  @ApiProperty({
    description: 'Descrição do host',
    example: 'Hotel de luxo com vista para o mar',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

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
    description: 'Dados dos representantes legais a serem atualizados',
    type: [UpdateLegalRepresentativeDto],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Representantes legais deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => UpdateLegalRepresentativeDto)
  legalRepresentatives?: UpdateLegalRepresentativeDto[];
}

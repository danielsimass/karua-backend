import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, IsUUID } from 'class-validator';

export class UpdateLegalRepresentativeDto {
  @ApiProperty({
    description: 'ID do representante legal',
    example: 'uuid',
  })
  @IsUUID('4', { message: 'ID deve ser um UUID válido' })
  id: string;

  @ApiProperty({
    description: 'Email do representante legal',
    example: 'joao.silva@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @Length(1, 255, { message: 'Email deve ter entre 1 e 255 caracteres' })
  email?: string;

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

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifySecureCodeDto {
  @ApiProperty({
    example: '123456',
    description: 'Código de verificação enviado por email',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty({ message: 'Código de verificação é obrigatório' })
  @IsString({ message: 'Código de verificação deve ser uma string' })
  @Length(6, 6, { message: 'Código deve ter exatamente 6 dígitos' })
  @Matches(/^\d{6}$/, { message: 'Código deve conter apenas números' })
  code: string;
}

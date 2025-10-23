import { IsNotEmpty, IsString, MinLength, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetFirstPasswordDto {
  @ApiProperty({ example: 'joaosilva', description: 'Username ou email do usuário' })
  @IsNotEmpty({ message: 'Username ou email é obrigatório' })
  @IsString({ message: 'Username ou email deve ser uma string' })
  username: string;

  @ApiProperty({ example: 'NovaSenhaForte123!', description: 'Nova senha do usuário' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

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
  secureCode: string;
}

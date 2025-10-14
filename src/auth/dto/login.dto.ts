import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'joaosilva', description: 'Username ou email do usuário' })
  @IsNotEmpty({ message: 'Username ou email é obrigatório' })
  @IsString({ message: 'Username ou email deve ser uma string' })
  username: string;

  @ApiProperty({ example: 'SenhaForte123!', description: 'Senha do usuário' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  password: string;
}

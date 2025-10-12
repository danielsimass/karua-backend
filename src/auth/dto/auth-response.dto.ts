import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 'uuid-user-id', description: 'ID do usuário' })
  userId: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ example: 'joao.silva@example.com', description: 'Email do usuário' })
  email: string;

  @ApiProperty({ example: 'admin', description: 'Nome do role do usuário' })
  role: string;

  @ApiProperty({ example: 'uuid-host-id', description: 'ID do host' })
  hostId: string;

  @ApiProperty({ example: 'Hotel Exemplo', description: 'Nome do host' })
  hostName: string;
}

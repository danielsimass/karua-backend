import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserManagerDto } from './dto/create-user-manager.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { RoleType } from './enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { HostId } from '../auth/decorators/host-id.decorator';

@ApiTags('usuarios')
@ApiBearerAuth()
@Controller('users')
@Roles(RoleType.MANAGER, RoleType.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário no próprio host (Manager)' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: User })
  @ApiResponse({ status: 409, description: 'Email ou username já cadastrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para managers e admins' })
  create(
    @Body() createUserManagerDto: CreateUserManagerDto,
    @HostId() hostId: string
  ): Promise<User> {
    return this.usersService.create({
      ...createUserManagerDto,
      hostId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários do próprio host (Manager)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [User] })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para managers e admins' })
  findAll(@HostId() hostId: string): Promise<User[]> {
    return this.usersService.findAll(hostId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuário por ID do próprio host (Manager)' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para managers e admins' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @HostId() hostId: string): Promise<User> {
    return this.usersService.findOne(id, hostId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um usuário do próprio host (Manager)' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Email ou username já cadastrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para managers e admins' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @HostId() hostId: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, hostId, updateUserDto);
  }

  @Patch(':id/change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Alterar senha do usuário do próprio host (Manager)' })
  @ApiResponse({ status: 204, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 401, description: 'Senha atual incorreta' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para managers e admins' })
  changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @HostId() hostId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    return this.usersService.changePassword(id, hostId, changePasswordDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desativar um usuário do próprio host (Manager)' })
  @ApiResponse({ status: 200, description: 'Usuário desativado', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para managers e admins' })
  deactivate(@Param('id', ParseUUIDPipe) id: string, @HostId() hostId: string): Promise<User> {
    return this.usersService.deactivate(id, hostId);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Ativar um usuário do próprio host (Manager)' })
  @ApiResponse({ status: 200, description: 'Usuário ativado', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para managers e admins' })
  activate(@Param('id', ParseUUIDPipe) id: string, @HostId() hostId: string): Promise<User> {
    return this.usersService.activate(id, hostId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um usuário do próprio host (Manager)' })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para managers e admins' })
  remove(@Param('id', ParseUUIDPipe) id: string, @HostId() hostId: string): Promise<void> {
    return this.usersService.remove(id, hostId);
  }
}

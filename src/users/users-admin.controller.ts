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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { RoleType } from './enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('users-admin')
@ApiBearerAuth()
@Controller('users-admin')
@Roles(RoleType.ADMIN)
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário (Admin Global)' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: User })
  @ApiResponse({ status: 409, description: 'Email ou username já cadastrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para admins' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get(':hostId')
  @ApiOperation({ summary: 'Listar todos os usuários de um host (Admin Global)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [User] })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para admins' })
  findAll(@Param('hostId', ParseUUIDPipe) hostId: string): Promise<User[]> {
    return this.usersService.findAll(hostId);
  }

  @Get(':hostId/:id')
  @ApiOperation({ summary: 'Buscar um usuário por ID (Admin Global)' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para admins' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('hostId', ParseUUIDPipe) hostId: string
  ): Promise<User> {
    return this.usersService.findOne(id, hostId);
  }

  @Patch(':hostId/:id')
  @ApiOperation({ summary: 'Atualizar um usuário (Admin Global)' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Email ou username já cadastrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para admins' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('hostId', ParseUUIDPipe) hostId: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, hostId, updateUserDto);
  }

  @Patch(':hostId/:id/change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Alterar senha do usuário (Admin Global)' })
  @ApiResponse({ status: 204, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 401, description: 'Senha atual incorreta' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para admins' })
  changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('hostId', ParseUUIDPipe) hostId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    return this.usersService.changePassword(id, hostId, changePasswordDto);
  }

  @Patch(':hostId/:id/deactivate')
  @ApiOperation({ summary: 'Desativar um usuário (Admin Global)' })
  @ApiResponse({ status: 200, description: 'Usuário desativado', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para admins' })
  deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('hostId', ParseUUIDPipe) hostId: string
  ): Promise<User> {
    return this.usersService.deactivate(id, hostId);
  }

  @Patch(':hostId/:id/activate')
  @ApiOperation({ summary: 'Ativar um usuário (Admin Global)' })
  @ApiResponse({ status: 200, description: 'Usuário ativado', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para admins' })
  activate(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('hostId', ParseUUIDPipe) hostId: string
  ): Promise<User> {
    return this.usersService.activate(id, hostId);
  }

  @Delete(':hostId/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um usuário (Admin Global)' })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - apenas para admins' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('hostId', ParseUUIDPipe) hostId: string
  ): Promise<void> {
    return this.usersService.remove(id, hostId);
  }

  @Get('roles')
  @ApiOperation({ summary: 'Listar todos os roles disponíveis' })
  @ApiResponse({ status: 200, description: 'Lista de roles' })
  findAllRoles(): { role: string; description: string }[] {
    return [
      { role: RoleType.ADMIN, description: 'Administrador do sistema com acesso total' },
      { role: RoleType.MANAGER, description: 'Gerente com acesso a gestão e relatórios' },
      {
        role: RoleType.RECEPTIONIST,
        description: 'Recepcionista com acesso a reservas e check-in/out',
      },
      { role: RoleType.STAFF, description: 'Funcionário com acesso básico' },
    ];
  }
}


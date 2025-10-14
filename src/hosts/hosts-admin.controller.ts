import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HostsService } from './hosts.service';
import { CreateHostDto } from './dto/create-host.dto';
import { Host } from './entities/host.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '../users/enums/role.enum';

@ApiTags('hosts-admin')
@Controller('hosts-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN)
@ApiBearerAuth()
export class HostsAdminController {
  constructor(private readonly hostsService: HostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo host com representante legal (apenas admins)' })
  @ApiResponse({
    status: 201,
    description: 'Host criado com sucesso',
    type: Host,
  })
  @ApiResponse({
    status: 409,
    description: 'CNPJ ou CPF do representante legal já cadastrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão (apenas admins)',
  })
  create(@Body() createHostDto: CreateHostDto): Promise<Host> {
    return this.hostsService.create(createHostDto);
  }
}

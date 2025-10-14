import { Controller, Get, Patch, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HostsService } from './hosts.service';
import { UpdateHostDto } from './dto/update-host.dto';
import { Host } from './entities/host.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { HostId } from '../auth/decorators/host-id.decorator';

@ApiTags('hosts')
@Controller('hosts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar dados do host do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Host retornado com sucesso',
    type: Host,
  })
  @ApiResponse({
    status: 404,
    description: 'Host não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  findMyHost(@HostId() hostId: string): Promise<Host> {
    return this.hostsService.findByHostId(hostId);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar dados do host do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Host atualizado com sucesso',
    type: Host,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou representante legal não encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Host não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autenticado',
  })
  updateMyHost(@HostId() hostId: string, @Body() updateHostDto: UpdateHostDto): Promise<Host> {
    return this.hostsService.update(hostId, updateHostDto);
  }
}

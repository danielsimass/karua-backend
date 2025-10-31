import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccommodationsService } from '../services/accommodations.service';
import { HostId } from '../../auth/decorators/host-id.decorator';
import { CreateAccommodationDto } from '../dto/accommodations/create-accommodation.dto';
import { UpdateAccommodationDto } from '../dto/accommodations/update-accommodation.dto';

@ApiTags('acomodacoes')
@ApiBearerAuth()
@Controller('accommodations')
export class AccommodationsController {
  constructor(private readonly accommodationsService: AccommodationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar acomodação' })
  @ApiResponse({ status: 201, description: 'Acomodação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  create(@HostId() hostId: string, @Body() dto: CreateAccommodationDto) {
    return this.accommodationsService.create(hostId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar acomodações do host' })
  @ApiResponse({ status: 200, description: 'Acomodações retornadas com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findAll(@HostId() hostId: string) {
    return this.accommodationsService.findAll(hostId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar acomodação por ID (restrita ao host)' })
  @ApiResponse({ status: 200, description: 'Acomodação encontrada' })
  @ApiResponse({ status: 404, description: 'Acomodação não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findOne(@HostId() hostId: string, @Param('id') id: string) {
    return this.accommodationsService.findOne(hostId, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar acomodação por ID' })
  @ApiResponse({ status: 200, description: 'Acomodação atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Acomodação não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  update(@HostId() hostId: string, @Param('id') id: string, @Body() dto: UpdateAccommodationDto) {
    return this.accommodationsService.update(hostId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir acomodação por ID' })
  @ApiResponse({ status: 204, description: 'Acomodação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Acomodação não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  remove(@HostId() hostId: string, @Param('id') id: string) {
    return this.accommodationsService.remove(hostId, id);
  }
}

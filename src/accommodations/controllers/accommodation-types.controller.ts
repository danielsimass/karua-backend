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
import { AccommodationTypesService } from '../services/accommodation-types.service';
import { HostId } from '../../auth/decorators/host-id.decorator';
import { CreateAccommodationTypeDto } from '../dto/accommodation-types/create-accommodation-type.dto';
import { UpdateAccommodationTypeDto } from '../dto/accommodation-types/update-accommodation-type.dto';

@ApiTags('tipos-de-acomodacao')
@ApiBearerAuth()
@Controller('accommodation-types')
export class AccommodationTypesController {
  constructor(private readonly accommodationTypesService: AccommodationTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar tipo de acomodação' })
  @ApiResponse({ status: 201, description: 'Tipo de acomodação criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  create(@HostId() hostId: string, @Body() dto: CreateAccommodationTypeDto) {
    return this.accommodationTypesService.create(hostId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar tipos de acomodação do host' })
  @ApiResponse({ status: 200, description: 'Tipos de acomodação retornados com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findAll(@HostId() hostId: string) {
    return this.accommodationTypesService.findAll(hostId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar tipo de acomodação por ID (restrito ao host)' })
  @ApiResponse({ status: 200, description: 'Tipo de acomodação encontrado' })
  @ApiResponse({ status: 404, description: 'Tipo de acomodação não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findOne(@HostId() hostId: string, @Param('id') id: string) {
    return this.accommodationTypesService.findOne(hostId, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar tipo de acomodação por ID' })
  @ApiResponse({ status: 200, description: 'Tipo de acomodação atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tipo de acomodação não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  update(
    @HostId() hostId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAccommodationTypeDto
  ) {
    return this.accommodationTypesService.update(hostId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir tipo de acomodação por ID' })
  @ApiResponse({ status: 204, description: 'Tipo de acomodação removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Tipo de acomodação não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  remove(@HostId() hostId: string, @Param('id') id: string) {
    return this.accommodationTypesService.remove(hostId, id);
  }
}

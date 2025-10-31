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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccommodationPricingSchedulesService } from '../services/accommodation-pricing-schedules.service';
import { HostId } from '../../auth/decorators/host-id.decorator';
import { CreateAccommodationPricingScheduleDto } from '../dto/accommodation-pricing-schedules/create-accommodation-pricing-schedule.dto';
import { UpdateAccommodationPricingScheduleDto } from '../dto/accommodation-pricing-schedules/update-accommodation-pricing-schedule.dto';

@ApiTags('cronogramas-de-precos')
@ApiBearerAuth()
@Controller('accommodation-pricing-schedules')
export class AccommodationPricingSchedulesController {
  constructor(private readonly pricingSchedulesService: AccommodationPricingSchedulesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar cronograma de preços' })
  @ApiResponse({ status: 201, description: 'Cronograma de preços criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Tipo de acomodação não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  create(@HostId() hostId: string, @Body() dto: CreateAccommodationPricingScheduleDto) {
    return this.pricingSchedulesService.create(hostId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar cronogramas de preços por tipo de acomodação',
  })
  @ApiResponse({
    status: 200,
    description: 'Cronogramas de preços retornados com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Tipo de acomodação não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findAll(@HostId() hostId: string, @Query('accommodationTypeId') accommodationTypeId: string) {
    return this.pricingSchedulesService.findAllByAccommodationType(hostId, accommodationTypeId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar cronograma de preços por ID' })
  @ApiResponse({ status: 200, description: 'Cronograma de preços encontrado' })
  @ApiResponse({ status: 404, description: 'Cronograma de preços não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  findOne(@Param('id') id: string) {
    return this.pricingSchedulesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar cronograma de preços por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cronograma de preços atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Cronograma de preços não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  update(
    @HostId() hostId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAccommodationPricingScheduleDto
  ) {
    return this.pricingSchedulesService.update(hostId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir cronograma de preços por ID' })
  @ApiResponse({ status: 204, description: 'Cronograma de preços removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Cronograma de preços não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  remove(@Param('id') id: string) {
    return this.pricingSchedulesService.remove(id);
  }
}

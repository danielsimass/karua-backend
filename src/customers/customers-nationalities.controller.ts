import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nationality } from './entities/nationality.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('nacionalidades')
@ApiBearerAuth()
@Controller('nationalities')
export class CustomersNationalitiesController {
  constructor(
    @InjectRepository(Nationality)
    private readonly nationalityRepository: Repository<Nationality>
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar nacionalidades' })
  @ApiResponse({ status: 200, description: 'Nacionalidades retornadas com sucesso' })
  async findAll(): Promise<Nationality[]> {
    return this.nationalityRepository.find({ order: { country: 'ASC' } });
  }
}

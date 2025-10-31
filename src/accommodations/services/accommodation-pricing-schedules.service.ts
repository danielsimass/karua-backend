import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AccommodationPricingSchedule } from '../entities/accommodation-pricing-schedule.entity';
import { CreateAccommodationPricingScheduleDto } from '../dto/accommodation-pricing-schedules/create-accommodation-pricing-schedule.dto';
import { UpdateAccommodationPricingScheduleDto } from '../dto/accommodation-pricing-schedules/update-accommodation-pricing-schedule.dto';
import { AccommodationPricingSchedulesRepository } from '../repositories/accommodation-pricing-schedules';
import { AccommodationTypesRepository } from '../repositories/accommodation-types';

@Injectable()
export class AccommodationPricingSchedulesService {
  constructor(
    private readonly pricingSchedulesRepository: AccommodationPricingSchedulesRepository,
    private readonly accommodationTypesRepository: AccommodationTypesRepository
  ) {}

  async create(
    hostId: string,
    data: CreateAccommodationPricingScheduleDto
  ): Promise<AccommodationPricingSchedule> {
    // Verificar se o tipo de acomodação pertence ao host
    const accommodationType = await this.accommodationTypesRepository.findByIdAndHostId(
      data.accommodationTypeId,
      hostId
    );
    if (!accommodationType) {
      throw new NotFoundException('Tipo de acomodação não encontrado');
    }

    // Validar que endDate > startDate
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (endDate <= startDate) {
      throw new BadRequestException('Data de término deve ser posterior à data de início');
    }

    const entity = this.pricingSchedulesRepository.create({
      ...data,
      startDate: startDate,
      endDate: endDate,
    });
    return await this.pricingSchedulesRepository.save(entity);
  }

  async findAllByAccommodationType(
    hostId: string,
    accommodationTypeId: string
  ): Promise<AccommodationPricingSchedule[]> {
    // Verificar se o tipo de acomodação pertence ao host
    const accommodationType = await this.accommodationTypesRepository.findByIdAndHostId(
      accommodationTypeId,
      hostId
    );
    if (!accommodationType) {
      throw new NotFoundException('Tipo de acomodação não encontrado');
    }

    return await this.pricingSchedulesRepository.findByAccommodationTypeIdAndHostId(
      accommodationTypeId,
      hostId
    );
  }

  async findOne(id: string): Promise<AccommodationPricingSchedule> {
    const pricingSchedule = await this.pricingSchedulesRepository.findById(id);
    if (!pricingSchedule) {
      throw new NotFoundException('Cronograma de preços não encontrado');
    }
    return pricingSchedule;
  }

  async update(
    hostId: string,
    id: string,
    data: UpdateAccommodationPricingScheduleDto
  ): Promise<AccommodationPricingSchedule> {
    const pricingSchedule = await this.findOne(id);

    // Se estiver atualizando accommodationTypeId, validar que pertence ao host
    if (data.accommodationTypeId) {
      const accommodationType = await this.accommodationTypesRepository.findByIdAndHostId(
        data.accommodationTypeId,
        hostId
      );
      if (!accommodationType) {
        throw new NotFoundException('Tipo de acomodação não encontrado');
      }
    }

    // Validar datas se ambas forem fornecidas
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      if (endDate <= startDate) {
        throw new BadRequestException('Data de término deve ser posterior à data de início');
      }
    }

    Object.assign(pricingSchedule, {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : pricingSchedule.startDate,
      endDate: data.endDate ? new Date(data.endDate) : pricingSchedule.endDate,
    });
    return await this.pricingSchedulesRepository.save(pricingSchedule);
  }

  async remove(id: string): Promise<void> {
    const pricingSchedule = await this.findOne(id);
    await this.pricingSchedulesRepository.remove(pricingSchedule);
  }
}

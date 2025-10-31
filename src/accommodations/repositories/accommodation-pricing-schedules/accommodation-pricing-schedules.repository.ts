import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccommodationPricingSchedule } from '../../entities/accommodation-pricing-schedule.entity';
import { IAccommodationPricingSchedulesRepository } from './accommodation-pricing-schedules.repository.interface';
import { AccommodationPricingScheduleCreateData } from './types';

@Injectable()
export class AccommodationPricingSchedulesRepository
  implements IAccommodationPricingSchedulesRepository
{
  constructor(
    @InjectRepository(AccommodationPricingSchedule)
    private readonly repository: Repository<AccommodationPricingSchedule>
  ) {}

  create(data: AccommodationPricingScheduleCreateData): AccommodationPricingSchedule {
    return this.repository.create(data);
  }

  async save(pricingSchedule: AccommodationPricingSchedule): Promise<AccommodationPricingSchedule> {
    return await this.repository.save(pricingSchedule);
  }

  async findById(id: string): Promise<AccommodationPricingSchedule | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByAccommodationTypeIdAndHostId(
    accommodationTypeId: string,
    hostId: string
  ): Promise<AccommodationPricingSchedule[]> {
    return this.repository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.accommodationType', 'type')
      .where('schedule.accommodationTypeId = :accommodationTypeId', {
        accommodationTypeId,
      })
      .andWhere('type.hostId = :hostId', { hostId })
      .orderBy('schedule.startDate', 'ASC')
      .getMany();
  }

  async remove(pricingSchedule: AccommodationPricingSchedule): Promise<void> {
    await this.repository.remove(pricingSchedule);
  }
}

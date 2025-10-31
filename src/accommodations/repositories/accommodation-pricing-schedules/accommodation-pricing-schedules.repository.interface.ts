import { AccommodationPricingSchedule } from '../../entities/accommodation-pricing-schedule.entity';
import {
  AccommodationPricingScheduleCreateData,
  AccommodationPricingScheduleUpdateData,
} from './types';

export interface IAccommodationPricingSchedulesRepository {
  create(data: AccommodationPricingScheduleCreateData): AccommodationPricingSchedule;
  save(pricingSchedule: AccommodationPricingSchedule): Promise<AccommodationPricingSchedule>;
  findById(id: string): Promise<AccommodationPricingSchedule | null>;
  findByAccommodationTypeIdAndHostId(
    accommodationTypeId: string,
    hostId: string
  ): Promise<AccommodationPricingSchedule[]>;
  remove(pricingSchedule: AccommodationPricingSchedule): Promise<void>;
}

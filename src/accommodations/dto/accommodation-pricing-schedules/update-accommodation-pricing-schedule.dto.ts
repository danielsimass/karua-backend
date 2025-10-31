import { PartialType } from '@nestjs/swagger';
import { CreateAccommodationPricingScheduleDto } from './create-accommodation-pricing-schedule.dto';

export class UpdateAccommodationPricingScheduleDto extends PartialType(
  CreateAccommodationPricingScheduleDto
) {}

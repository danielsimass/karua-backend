import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccommodationType } from './entities/accommodation-type.entity';
import { Accommodation } from './entities/accommodation.entity';
import { AccommodationPricingSchedule } from './entities/accommodation-pricing-schedule.entity';
import { AccommodationTypesRepository } from './repositories/accommodation-types';
import { AccommodationsRepository } from './repositories/accommodations';
import { AccommodationPricingSchedulesRepository } from './repositories/accommodation-pricing-schedules';
import { AccommodationTypesService } from './services/accommodation-types.service';
import { AccommodationsService } from './services/accommodations.service';
import { AccommodationPricingSchedulesService } from './services/accommodation-pricing-schedules.service';
import { AccommodationTypesController } from './controllers/accommodation-types.controller';
import { AccommodationsController } from './controllers/accommodations.controller';
import { AccommodationPricingSchedulesController } from './controllers/accommodation-pricing-schedules.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccommodationType, Accommodation, AccommodationPricingSchedule]),
  ],
  controllers: [
    AccommodationTypesController,
    AccommodationsController,
    AccommodationPricingSchedulesController,
  ],
  providers: [
    AccommodationTypesService,
    AccommodationsService,
    AccommodationPricingSchedulesService,
    AccommodationTypesRepository,
    AccommodationsRepository,
    AccommodationPricingSchedulesRepository,
  ],
})
export class AccommodationsModule {}

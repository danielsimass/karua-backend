import { IsDateString, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateAccommodationPricingScheduleDto {
  @IsUUID()
  accommodationTypeId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(0)
  price: number;
}

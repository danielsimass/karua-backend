export type AccommodationPricingScheduleUpdateData = Partial<{
  accommodationTypeId: string;
  startDate: Date | string;
  endDate: Date | string;
  price: number;
}>;

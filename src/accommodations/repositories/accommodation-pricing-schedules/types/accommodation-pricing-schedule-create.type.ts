export type AccommodationPricingScheduleCreateData = {
  accommodationTypeId: string;
  startDate: Date | string;
  endDate: Date | string;
  price: number;
};

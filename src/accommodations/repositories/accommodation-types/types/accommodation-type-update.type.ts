export type AccommodationTypeUpdateData = Partial<{
  name: string;
  capacity: number;
  rooms: number;
  bathrooms: number;
  minOccupants: number;
  maxOccupants: number;
  isActive: boolean;
}>;

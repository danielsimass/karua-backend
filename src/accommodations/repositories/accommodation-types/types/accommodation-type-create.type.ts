export type AccommodationTypeCreateData = {
  name: string;
  capacity: number;
  rooms: number;
  bathrooms: number;
  minOccupants?: number;
  maxOccupants: number;
  hostId: string;
  isActive?: boolean;
};

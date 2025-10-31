import { Accommodation } from '../../entities/accommodation.entity';
import { AccommodationCreateData, AccommodationUpdateData } from './types';

export interface IAccommodationsRepository {
  create(data: AccommodationCreateData): Accommodation;
  save(accommodation: Accommodation): Promise<Accommodation>;
  findById(id: string): Promise<Accommodation | null>;
  findByIdAndHostId(id: string, hostId: string): Promise<Accommodation | null>;
  findAllByHostId(hostId: string): Promise<Accommodation[]>;
  remove(accommodation: Accommodation): Promise<void>;
}

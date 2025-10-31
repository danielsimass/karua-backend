import { AccommodationType } from '../../entities/accommodation-type.entity';
import { AccommodationTypeCreateData, AccommodationTypeUpdateData } from './types';

export interface IAccommodationTypesRepository {
  create(data: AccommodationTypeCreateData): AccommodationType;
  save(accommodationType: AccommodationType): Promise<AccommodationType>;
  findById(id: string): Promise<AccommodationType | null>;
  findByIdAndHostId(id: string, hostId: string): Promise<AccommodationType | null>;
  findAllByHostId(hostId: string): Promise<AccommodationType[]>;
  remove(accommodationType: AccommodationType): Promise<void>;
}

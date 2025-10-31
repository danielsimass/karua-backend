import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccommodationType } from '../../entities/accommodation-type.entity';
import { IAccommodationTypesRepository } from './accommodation-types.repository.interface';
import { AccommodationTypeCreateData } from './types';

@Injectable()
export class AccommodationTypesRepository implements IAccommodationTypesRepository {
  constructor(
    @InjectRepository(AccommodationType)
    private readonly repository: Repository<AccommodationType>
  ) {}

  create(data: AccommodationTypeCreateData): AccommodationType {
    return this.repository.create(data);
  }

  async save(accommodationType: AccommodationType): Promise<AccommodationType> {
    return await this.repository.save(accommodationType);
  }

  async findById(id: string): Promise<AccommodationType | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIdAndHostId(id: string, hostId: string): Promise<AccommodationType | null> {
    return this.repository.findOne({ where: { id, hostId } });
  }

  async findAllByHostId(hostId: string): Promise<AccommodationType[]> {
    return this.repository.find({
      where: { hostId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(accommodationType: AccommodationType): Promise<void> {
    await this.repository.remove(accommodationType);
  }
}

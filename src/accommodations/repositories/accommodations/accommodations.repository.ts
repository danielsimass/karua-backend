import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accommodation } from '../../entities/accommodation.entity';
import { IAccommodationsRepository } from './accommodations.repository.interface';
import { AccommodationCreateData } from './types';

@Injectable()
export class AccommodationsRepository implements IAccommodationsRepository {
  constructor(
    @InjectRepository(Accommodation)
    private readonly repository: Repository<Accommodation>
  ) {}

  create(data: AccommodationCreateData): Accommodation {
    return this.repository.create(data);
  }

  async save(accommodation: Accommodation): Promise<Accommodation> {
    return await this.repository.save(accommodation);
  }

  async findById(id: string): Promise<Accommodation | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIdAndHostId(id: string, hostId: string): Promise<Accommodation | null> {
    return this.repository.findOne({ where: { id, hostId } });
  }

  async findAllByHostId(hostId: string): Promise<Accommodation[]> {
    return this.repository.find({
      where: { hostId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(accommodation: Accommodation): Promise<void> {
    await this.repository.remove(accommodation);
  }
}

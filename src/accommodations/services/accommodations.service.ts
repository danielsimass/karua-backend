import { Injectable, NotFoundException } from '@nestjs/common';
import { Accommodation } from '../entities/accommodation.entity';
import { CreateAccommodationDto } from '../dto/accommodations/create-accommodation.dto';
import { UpdateAccommodationDto } from '../dto/accommodations/update-accommodation.dto';
import { AccommodationsRepository } from '../repositories/accommodations';

@Injectable()
export class AccommodationsService {
  constructor(private readonly accommodationsRepository: AccommodationsRepository) {}

  async create(hostId: string, data: CreateAccommodationDto): Promise<Accommodation> {
    const entity = this.accommodationsRepository.create({
      ...data,
      hostId,
      status: data.status ?? true,
    });
    return await this.accommodationsRepository.save(entity);
  }

  async findAll(hostId: string): Promise<Accommodation[]> {
    return await this.accommodationsRepository.findAllByHostId(hostId);
  }

  async findOne(hostId: string, id: string): Promise<Accommodation> {
    const accommodation = await this.accommodationsRepository.findByIdAndHostId(id, hostId);
    if (!accommodation) {
      throw new NotFoundException('Acomodação não encontrada');
    }
    return accommodation;
  }

  async update(hostId: string, id: string, data: UpdateAccommodationDto): Promise<Accommodation> {
    const accommodation = await this.findOne(hostId, id);
    Object.assign(accommodation, data);
    return await this.accommodationsRepository.save(accommodation);
  }

  async remove(hostId: string, id: string): Promise<void> {
    const accommodation = await this.findOne(hostId, id);
    await this.accommodationsRepository.remove(accommodation);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { AccommodationType } from '../entities/accommodation-type.entity';
import { CreateAccommodationTypeDto } from '../dto/accommodation-types/create-accommodation-type.dto';
import { UpdateAccommodationTypeDto } from '../dto/accommodation-types/update-accommodation-type.dto';
import { AccommodationTypesRepository } from '../repositories/accommodation-types';

@Injectable()
export class AccommodationTypesService {
  constructor(private readonly accommodationTypesRepository: AccommodationTypesRepository) {}

  async create(hostId: string, data: CreateAccommodationTypeDto): Promise<AccommodationType> {
    const entity = this.accommodationTypesRepository.create({
      ...data,
      hostId,
      minOccupants: data.minOccupants ?? 1,
    });
    return await this.accommodationTypesRepository.save(entity);
  }

  async findAll(hostId: string): Promise<AccommodationType[]> {
    return await this.accommodationTypesRepository.findAllByHostId(hostId);
  }

  async findOne(hostId: string, id: string): Promise<AccommodationType> {
    const accommodationType = await this.accommodationTypesRepository.findByIdAndHostId(id, hostId);
    if (!accommodationType) {
      throw new NotFoundException('Tipo de acomodação não encontrado');
    }
    return accommodationType;
  }

  async update(
    hostId: string,
    id: string,
    data: UpdateAccommodationTypeDto
  ): Promise<AccommodationType> {
    const accommodationType = await this.findOne(hostId, id);
    Object.assign(accommodationType, data);
    return await this.accommodationTypesRepository.save(accommodationType);
  }

  async remove(hostId: string, id: string): Promise<void> {
    const accommodationType = await this.findOne(hostId, id);
    await this.accommodationTypesRepository.remove(accommodationType);
  }
}

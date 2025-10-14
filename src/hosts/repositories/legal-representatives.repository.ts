import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LegalRepresentative } from '../entities/legal-representative.entity';
import { ILegalRepresentativesRepository } from './legal-representatives.repository.interface';
import { LegalRepresentativeCreateData } from './types';

@Injectable()
export class LegalRepresentativesRepository implements ILegalRepresentativesRepository {
  constructor(
    @InjectRepository(LegalRepresentative)
    private readonly repository: Repository<LegalRepresentative>
  ) {}

  create(data: LegalRepresentativeCreateData): LegalRepresentative {
    return this.repository.create(data);
  }

  async save(legalRepresentative: LegalRepresentative): Promise<LegalRepresentative> {
    return this.repository.save(legalRepresentative);
  }

  async findById(id: string): Promise<LegalRepresentative | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByCpf(cpf: string): Promise<LegalRepresentative | null> {
    return this.repository.findOne({
      where: { cpf },
    });
  }

  async findByIdAndHostId(id: string, hostId: string): Promise<LegalRepresentative | null> {
    return this.repository.findOne({
      where: { id, hostId },
    });
  }

  async findByHostId(hostId: string): Promise<LegalRepresentative[]> {
    return this.repository.find({
      where: { hostId },
    });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

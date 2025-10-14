import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Host } from '../entities/host.entity';
import { IHostsRepository } from './hosts.repository.interface';
import { HostCreateData, HostUpdateData } from './types';

@Injectable()
export class HostsRepository implements IHostsRepository {
  constructor(
    @InjectRepository(Host)
    private readonly repository: Repository<Host>
  ) {}

  create(data: HostCreateData): Host {
    return this.repository.create(data);
  }

  async save(host: Host): Promise<Host> {
    return this.repository.save(host);
  }

  async findById(id: string, relations: string[] = []): Promise<Host | null> {
    return this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findByCnpj(cnpj: string): Promise<Host | null> {
    return this.repository.findOne({
      where: { cnpj },
    });
  }

  async findAll(relations: string[] = []): Promise<Host[]> {
    return this.repository.find({ relations });
  }

  async update(id: string, updateData: HostUpdateData): Promise<Host> {
    await this.repository.update(id, updateData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Host not found after update');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

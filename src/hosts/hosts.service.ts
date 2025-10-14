import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { Host } from './entities/host.entity';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import { HostsRepository } from './repositories/hosts.repository';
import { LegalRepresentativesRepository } from './repositories/legal-representatives.repository';
import { isValidCNPJ, isValidCPF, cleanDocument } from '../common';

@Injectable()
export class HostsService {
  constructor(
    private readonly hostsRepository: HostsRepository,
    private readonly legalRepresentativesRepository: LegalRepresentativesRepository
  ) {}

  @Transactional()
  async create(createHostDto: CreateHostDto): Promise<Host> {
    let cleanCnpj: string | undefined;
    if (createHostDto.cnpj) {
      cleanCnpj = cleanDocument(createHostDto.cnpj);

      if (!isValidCNPJ(cleanCnpj)) {
        throw new BadRequestException('CNPJ inválido');
      }

      const existingHost = await this.hostsRepository.findByCnpj(cleanCnpj);
      if (existingHost) {
        throw new ConflictException('Já existe um host cadastrado com este CNPJ');
      }
    }

    const cleanCpf = cleanDocument(createHostDto.legalRepresentative.cpf);

    if (!isValidCPF(cleanCpf)) {
      throw new BadRequestException('CPF do representante legal inválido');
    }

    const existingLegalRep = await this.legalRepresentativesRepository.findByCpf(cleanCpf);
    if (existingLegalRep) {
      throw new ConflictException('Já existe um representante legal cadastrado com este CPF');
    }
    const host = this.hostsRepository.create({
      name: createHostDto.name,
      description: createHostDto.description,
      ...(cleanCnpj && { cnpj: cleanCnpj }),
      cep: createHostDto.cep,
      street: createHostDto.street,
      number: createHostDto.number,
      state: createHostDto.state,
      phone: createHostDto.phone,
      email: createHostDto.email,
      isActive: createHostDto.isActive ?? true,
      legalRepresentatives: [
        {
          name: createHostDto.legalRepresentative.name,
          email: createHostDto.legalRepresentative.email,
          cpf: cleanCpf,
          phone: createHostDto.legalRepresentative.phone,
        },
      ],
    });

    return this.hostsRepository.save(host);
  }

  async findByHostId(hostId: string): Promise<Host> {
    const host = await this.hostsRepository.findById(hostId, ['legalRepresentatives']);
    if (!host) {
      throw new NotFoundException('Host não encontrado');
    }
    return host;
  }

  @Transactional()
  async update(hostId: string, updateHostDto: UpdateHostDto): Promise<Host> {
    const host = await this.hostsRepository.findById(hostId, ['legalRepresentatives']);

    if (!host) {
      throw new NotFoundException('Host não encontrado');
    }
    if (updateHostDto.description !== undefined) {
      host.description = updateHostDto.description;
    }
    if (updateHostDto.cep !== undefined) {
      host.cep = updateHostDto.cep;
    }
    if (updateHostDto.street !== undefined) {
      host.street = updateHostDto.street;
    }
    if (updateHostDto.number !== undefined) {
      host.number = updateHostDto.number;
    }
    if (updateHostDto.state !== undefined) {
      host.state = updateHostDto.state;
    }
    if (updateHostDto.phone !== undefined) {
      host.phone = updateHostDto.phone;
    }
    if (updateHostDto.email !== undefined) {
      host.email = updateHostDto.email;
    }
    await this.hostsRepository.save(host);
    if (updateHostDto.legalRepresentatives && updateHostDto.legalRepresentatives.length > 0) {
      for (const repDto of updateHostDto.legalRepresentatives) {
        const legalRep = await this.legalRepresentativesRepository.findByIdAndHostId(
          repDto.id,
          host.id
        );
        if (!legalRep) {
          throw new BadRequestException(
            `Representante legal com ID ${repDto.id} não encontrado para este host`
          );
        }
        if (repDto.email !== undefined) {
          legalRep.email = repDto.email;
        }
        if (repDto.phone !== undefined) {
          legalRep.phone = repDto.phone;
        }
        await this.legalRepresentativesRepository.save(legalRep);
      }
    }
    return this.findByHostId(hostId);
  }
}

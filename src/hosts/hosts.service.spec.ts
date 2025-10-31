import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

// Mock completo do módulo @nestjs-cls/transactional para os testes
// Isso evita que o decorator @Transactional tente acessar o TransactionHost não inicializado
jest.mock('@nestjs-cls/transactional', () => {
  // Decorator no-op que simplesmente retorna o método original sem modificações
  const noOpTransactional = () => {
    return (
      target: any,
      propertyKey: string | symbol | undefined,
      descriptor: PropertyDescriptor
    ) => {
      // Retorna o descriptor sem modificações - comportamento normal para testes
      return descriptor;
    };
  };

  // Mock do TransactionHost que sempre retorna uma instância válida
  class MockTransactionHost {
    static getInstance() {
      return {
        withTransaction: async (fn: any) => {
          // Simplesmente executa a função passada sem transação
          if (typeof fn === 'function') {
            return await fn();
          }
          return fn;
        },
      };
    }
  }

  return {
    Transactional: noOpTransactional,
    TransactionHost: MockTransactionHost,
  };
});

import { HostsService } from './hosts.service';
import { HostsRepository } from './repositories/hosts.repository';
import { LegalRepresentativesRepository } from './repositories/legal-representatives.repository';
import { Host } from './entities/host.entity';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';

describe('HostsService', () => {
  let service: HostsService;
  let hostsRepository: jest.Mocked<HostsRepository>;
  let legalRepresentativesRepository: jest.Mocked<LegalRepresentativesRepository>;

  const mockHost: Host = {
    id: 'host-id',
    name: 'Hotel Teste',
    description: 'Descrição do hotel',
    cnpj: '12345678000190',
    cep: '12345678',
    street: 'Rua Teste',
    number: '123',
    state: 'SP',
    phone: '11999999999',
    email: 'hotel@teste.com',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    legalRepresentatives: [],
  };

  const mockHostsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findByCnpj: jest.fn(),
  };

  const mockLegalRepresentativesRepository = {
    findByCpf: jest.fn(),
    findByIdAndHostId: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    // Mock ClsService (pode ser usado por outros serviços também)
    const mockClsService = {
      get: jest.fn(),
      set: jest.fn(),
      getId: jest.fn(),
      run: jest.fn((fn) => fn()),
      runWith: jest.fn((fn) => fn()),
      enter: jest.fn(),
      exit: jest.fn(),
      isActive: jest.fn(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HostsService,
        {
          provide: HostsRepository,
          useValue: mockHostsRepository,
        },
        {
          provide: LegalRepresentativesRepository,
          useValue: mockLegalRepresentativesRepository,
        },
        {
          provide: ClsService,
          useValue: mockClsService,
        },
      ],
    }).compile();

    service = module.get<HostsService>(HostsService);
    hostsRepository = module.get(HostsRepository);
    legalRepresentativesRepository = module.get(LegalRepresentativesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByHostId', () => {
    it('should return a host when found', async () => {
      mockHostsRepository.findById.mockResolvedValue(mockHost);

      const result = await service.findByHostId('host-id');

      expect(hostsRepository.findById).toHaveBeenCalledWith('host-id', ['legalRepresentatives']);
      expect(result).toEqual(mockHost);
    });

    it('should throw NotFoundException when host not found', async () => {
      mockHostsRepository.findById.mockResolvedValue(null);

      await expect(service.findByHostId('host-id')).rejects.toThrow(NotFoundException);
      await expect(service.findByHostId('host-id')).rejects.toThrow('Host não encontrado');
    });
  });

  describe('create', () => {
    it('should create a host with valid CNPJ and CPF', async () => {
      const createDto: CreateHostDto = {
        name: 'Hotel Teste',
        description: 'Descrição',
        cnpj: '11.222.333/0001-81', // CNPJ válido
        legalRepresentative: {
          name: 'João Silva',
          email: 'joao@teste.com',
          cpf: '123.456.789-09', // CPF válido
          phone: '11999999999',
        },
      };

      mockHostsRepository.findByCnpj.mockResolvedValue(null);
      mockLegalRepresentativesRepository.findByCpf.mockResolvedValue(null);
      mockHostsRepository.create.mockReturnValue(mockHost);
      mockHostsRepository.save.mockResolvedValue(mockHost);

      const result = await service.create(createDto);

      expect(hostsRepository.findByCnpj).toHaveBeenCalledWith('11222333000181');
      expect(legalRepresentativesRepository.findByCpf).toHaveBeenCalledWith('12345678909');
      expect(hostsRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockHost);
    });

    it('should throw ConflictException when CNPJ already exists', async () => {
      const createDto: CreateHostDto = {
        name: 'Hotel Teste',
        legalRepresentative: {
          name: 'João Silva',
          email: 'joao@teste.com',
          cpf: '123.456.789-09',
        },
        cnpj: '11.222.333/0001-81', // CNPJ válido
      };

      mockHostsRepository.findByCnpj.mockResolvedValue(mockHost);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow(
        'Já existe um host cadastrado com este CNPJ'
      );
    });

    it('should throw ConflictException when CPF already exists', async () => {
      const createDto: CreateHostDto = {
        name: 'Hotel Teste',
        legalRepresentative: {
          name: 'João Silva',
          email: 'joao@teste.com',
          cpf: '123.456.789-09',
        },
      };

      mockHostsRepository.findByCnpj.mockResolvedValue(null);
      mockLegalRepresentativesRepository.findByCpf.mockResolvedValue({} as any);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow(
        'Já existe um representante legal cadastrado com este CPF'
      );
    });

    it('should throw BadRequestException when CNPJ is invalid', async () => {
      const createDto: CreateHostDto = {
        name: 'Hotel Teste',
        cnpj: '12.345.678/0001-99',
        legalRepresentative: {
          name: 'João Silva',
          email: 'joao@teste.com',
          cpf: '123.456.789-09',
        },
      };

      mockHostsRepository.findByCnpj.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto)).rejects.toThrow('CNPJ inválido');
    });

    it('should throw BadRequestException when CPF is invalid', async () => {
      const createDto: CreateHostDto = {
        name: 'Hotel Teste',
        legalRepresentative: {
          name: 'João Silva',
          email: 'joao@teste.com',
          cpf: '123.456.789-99',
        },
      };

      mockHostsRepository.findByCnpj.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto)).rejects.toThrow(
        'CPF do representante legal inválido'
      );
    });
  });

  describe('update', () => {
    it('should update a host', async () => {
      const updateDto: UpdateHostDto = {
        description: 'Nova descrição',
        email: 'novo@email.com',
      };

      mockHostsRepository.findById.mockResolvedValue(mockHost);
      mockHostsRepository.save.mockResolvedValue(mockHost);

      const result = await service.update('host-id', updateDto);

      expect(hostsRepository.findById).toHaveBeenCalledWith('host-id', ['legalRepresentatives']);
      expect(hostsRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockHost);
    });

    it('should throw NotFoundException when host not found', async () => {
      const updateDto: UpdateHostDto = { description: 'Nova descrição' };
      mockHostsRepository.findById.mockResolvedValue(null);

      await expect(service.update('host-id', updateDto)).rejects.toThrow(NotFoundException);
    });
  });
});

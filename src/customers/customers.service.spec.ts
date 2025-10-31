import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersRepository } from './repositories';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: jest.Mocked<CustomersRepository>;

  const mockCustomer: Customer = {
    id: 'customer-id',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    birthDate: new Date('1990-01-01'),
    gender: null,
    nationalityId: null,
    hostId: 'host-id',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    nationality: null,
    host: null,
    documents: [],
    contacts: [],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findByIdAndHostId: jest.fn(),
    findAllByHostId: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: CustomersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repository = module.get(CustomersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createDto: CreateCustomerDto = {
        name: 'João Silva',
        email: 'joao.silva@example.com',
      };

      mockRepository.create.mockReturnValue(mockCustomer);
      mockRepository.save.mockResolvedValue(mockCustomer);

      const result = await service.create('host-id', createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        hostId: 'host-id',
      });
      expect(repository.save).toHaveBeenCalledWith(mockCustomer);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('findAll', () => {
    it('should return all customers for a host', async () => {
      const customers = [mockCustomer];
      mockRepository.findAllByHostId.mockResolvedValue(customers);

      const result = await service.findAll('host-id');

      expect(repository.findAllByHostId).toHaveBeenCalledWith('host-id');
      expect(result).toEqual(customers);
    });
  });

  describe('findOne', () => {
    it('should return a customer when found', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(mockCustomer);

      const result = await service.findOne('host-id', 'customer-id');

      expect(repository.findByIdAndHostId).toHaveBeenCalledWith('customer-id', 'host-id');
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException when customer not found', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(service.findOne('host-id', 'customer-id')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('host-id', 'customer-id')).rejects.toThrow(
        'Customer não encontrado'
      );
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateDto: UpdateCustomerDto = {
        name: 'João da Silva',
      };
      const updatedCustomer = { ...mockCustomer, name: 'João da Silva' };

      mockRepository.findByIdAndHostId.mockResolvedValue(mockCustomer);
      mockRepository.save.mockResolvedValue(updatedCustomer);

      const result = await service.update('host-id', 'customer-id', updateDto);

      expect(repository.findByIdAndHostId).toHaveBeenCalledWith('customer-id', 'host-id');
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'João da Silva' })
      );
      expect(result).toEqual(updatedCustomer);
    });

    it('should throw NotFoundException when customer not found', async () => {
      const updateDto: UpdateCustomerDto = { name: 'João da Silva' };
      mockRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(service.update('host-id', 'customer-id', updateDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(mockCustomer);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove('host-id', 'customer-id');

      expect(repository.findByIdAndHostId).toHaveBeenCalledWith('customer-id', 'host-id');
      expect(repository.remove).toHaveBeenCalledWith(mockCustomer);
    });

    it('should throw NotFoundException when customer not found', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(service.remove('host-id', 'customer-id')).rejects.toThrow(NotFoundException);
    });
  });
});

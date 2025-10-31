import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AccommodationTypesService } from './accommodation-types.service';
import { AccommodationTypesRepository } from '../repositories/accommodation-types';
import { AccommodationType } from '../entities/accommodation-type.entity';
import { CreateAccommodationTypeDto } from '../dto/accommodation-types/create-accommodation-type.dto';
import { UpdateAccommodationTypeDto } from '../dto/accommodation-types/update-accommodation-type.dto';

describe('AccommodationTypesService', () => {
  let service: AccommodationTypesService;
  let repository: jest.Mocked<AccommodationTypesRepository>;

  const mockAccommodationType: AccommodationType = {
    id: 'accommodation-type-id',
    name: 'Quarto Standard',
    capacity: 2,
    rooms: 1,
    bathrooms: 1,
    minOccupants: 1,
    maxOccupants: 2,
    hostId: 'host-id',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    host: null,
    accommodations: [],
    pricingSchedules: [],
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
        AccommodationTypesService,
        {
          provide: AccommodationTypesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AccommodationTypesService>(AccommodationTypesService);
    repository = module.get(AccommodationTypesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an accommodation type with default minOccupants', async () => {
      const createDto: CreateAccommodationTypeDto = {
        name: 'Quarto Standard',
        capacity: 2,
        rooms: 1,
        bathrooms: 1,
        maxOccupants: 2,
      };

      mockRepository.create.mockReturnValue(mockAccommodationType);
      mockRepository.save.mockResolvedValue(mockAccommodationType);

      const result = await service.create('host-id', createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        hostId: 'host-id',
        minOccupants: 1,
      });
      expect(repository.save).toHaveBeenCalledWith(mockAccommodationType);
      expect(result).toEqual(mockAccommodationType);
    });

    it('should create an accommodation type with custom minOccupants', async () => {
      const createDto: CreateAccommodationTypeDto = {
        name: 'Quarto Standard',
        capacity: 4,
        rooms: 1,
        bathrooms: 1,
        minOccupants: 2,
        maxOccupants: 4,
      };

      mockRepository.create.mockReturnValue({
        ...mockAccommodationType,
        minOccupants: 2,
        maxOccupants: 4,
      });
      mockRepository.save.mockResolvedValue(mockAccommodationType);

      const result = await service.create('host-id', createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        hostId: 'host-id',
      });
      expect(result).toEqual(mockAccommodationType);
    });
  });

  describe('findAll', () => {
    it('should return all accommodation types for a host', async () => {
      const accommodationTypes = [mockAccommodationType];
      mockRepository.findAllByHostId.mockResolvedValue(accommodationTypes);

      const result = await service.findAll('host-id');

      expect(repository.findAllByHostId).toHaveBeenCalledWith('host-id');
      expect(result).toEqual(accommodationTypes);
    });
  });

  describe('findOne', () => {
    it('should return an accommodation type when found', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(mockAccommodationType);

      const result = await service.findOne('host-id', 'accommodation-type-id');

      expect(repository.findByIdAndHostId).toHaveBeenCalledWith('accommodation-type-id', 'host-id');
      expect(result).toEqual(mockAccommodationType);
    });

    it('should throw NotFoundException when accommodation type not found', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(service.findOne('host-id', 'accommodation-type-id')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.findOne('host-id', 'accommodation-type-id')).rejects.toThrow(
        'Tipo de acomodação não encontrado'
      );
    });
  });

  describe('update', () => {
    it('should update an accommodation type', async () => {
      const updateDto: UpdateAccommodationTypeDto = {
        name: 'Quarto Deluxe',
      };
      const updatedAccommodationType = {
        ...mockAccommodationType,
        name: 'Quarto Deluxe',
      };

      mockRepository.findByIdAndHostId.mockResolvedValue(mockAccommodationType);
      mockRepository.save.mockResolvedValue(updatedAccommodationType);

      const result = await service.update('host-id', 'accommodation-type-id', updateDto);

      expect(repository.findByIdAndHostId).toHaveBeenCalledWith('accommodation-type-id', 'host-id');
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Quarto Deluxe' })
      );
      expect(result).toEqual(updatedAccommodationType);
    });

    it('should throw NotFoundException when accommodation type not found', async () => {
      const updateDto: UpdateAccommodationTypeDto = { name: 'Quarto Deluxe' };
      mockRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(service.update('host-id', 'accommodation-type-id', updateDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should remove an accommodation type', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(mockAccommodationType);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove('host-id', 'accommodation-type-id');

      expect(repository.findByIdAndHostId).toHaveBeenCalledWith('accommodation-type-id', 'host-id');
      expect(repository.remove).toHaveBeenCalledWith(mockAccommodationType);
    });

    it('should throw NotFoundException when accommodation type not found', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(service.remove('host-id', 'accommodation-type-id')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});

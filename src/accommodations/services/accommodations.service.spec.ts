import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AccommodationsService } from './accommodations.service';
import { AccommodationsRepository } from '../repositories/accommodations';
import { Accommodation } from '../entities/accommodation.entity';
import { CreateAccommodationDto } from '../dto/accommodations/create-accommodation.dto';
import { UpdateAccommodationDto } from '../dto/accommodations/update-accommodation.dto';

describe('AccommodationsService', () => {
  let service: AccommodationsService;
  let repository: jest.Mocked<AccommodationsRepository>;

  const mockAccommodation: Accommodation = {
    id: 'accommodation-id',
    accommodationTypeId: 'accommodation-type-id',
    identifier: '101',
    floor: 1,
    status: true,
    hostId: 'host-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    accommodationType: null,
    host: null,
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
        AccommodationsService,
        {
          provide: AccommodationsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AccommodationsService>(AccommodationsService);
    repository = module.get(AccommodationsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an accommodation with default status', async () => {
      const createDto: CreateAccommodationDto = {
        accommodationTypeId: 'accommodation-type-id',
        identifier: '101',
        floor: 1,
      };

      mockRepository.create.mockReturnValue(mockAccommodation);
      mockRepository.save.mockResolvedValue(mockAccommodation);

      const result = await service.create('host-id', createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        hostId: 'host-id',
        status: true,
      });
      expect(repository.save).toHaveBeenCalledWith(mockAccommodation);
      expect(result).toEqual(mockAccommodation);
    });

    it('should create an accommodation with custom status', async () => {
      const createDto: CreateAccommodationDto = {
        accommodationTypeId: 'accommodation-type-id',
        identifier: '101',
        status: false,
      };

      mockRepository.create.mockReturnValue({
        ...mockAccommodation,
        status: false,
      });
      mockRepository.save.mockResolvedValue(mockAccommodation);

      const result = await service.create('host-id', createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        hostId: 'host-id',
      });
      expect(result).toEqual(mockAccommodation);
    });
  });

  describe('findAll', () => {
    it('should return all accommodations for a host', async () => {
      const accommodations = [mockAccommodation];
      mockRepository.findAllByHostId.mockResolvedValue(accommodations);

      const result = await service.findAll('host-id');

      expect(repository.findAllByHostId).toHaveBeenCalledWith('host-id');
      expect(result).toEqual(accommodations);
    });
  });

  describe('findOne', () => {
    it('should return an accommodation when found', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(mockAccommodation);

      const result = await service.findOne('host-id', 'accommodation-id');

      expect(repository.findByIdAndHostId).toHaveBeenCalledWith('accommodation-id', 'host-id');
      expect(result).toEqual(mockAccommodation);
    });

    it('should throw NotFoundException when accommodation not found', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(service.findOne('host-id', 'accommodation-id')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.findOne('host-id', 'accommodation-id')).rejects.toThrow(
        'Acomodação não encontrada'
      );
    });
  });

  describe('update', () => {
    it('should update an accommodation', async () => {
      const updateDto: UpdateAccommodationDto = {
        identifier: '102',
      };
      const updatedAccommodation = { ...mockAccommodation, identifier: '102' };

      mockRepository.findByIdAndHostId.mockResolvedValue(mockAccommodation);
      mockRepository.save.mockResolvedValue(updatedAccommodation);

      const result = await service.update('host-id', 'accommodation-id', updateDto);

      expect(repository.findByIdAndHostId).toHaveBeenCalledWith('accommodation-id', 'host-id');
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ identifier: '102' }));
      expect(result).toEqual(updatedAccommodation);
    });

    it('should throw NotFoundException when accommodation not found', async () => {
      const updateDto: UpdateAccommodationDto = { identifier: '102' };
      mockRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(service.update('host-id', 'accommodation-id', updateDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should remove an accommodation', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(mockAccommodation);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove('host-id', 'accommodation-id');

      expect(repository.findByIdAndHostId).toHaveBeenCalledWith('accommodation-id', 'host-id');
      expect(repository.remove).toHaveBeenCalledWith(mockAccommodation);
    });

    it('should throw NotFoundException when accommodation not found', async () => {
      mockRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(service.remove('host-id', 'accommodation-id')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});

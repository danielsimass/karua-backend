import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AccommodationPricingSchedulesService } from './accommodation-pricing-schedules.service';
import { AccommodationPricingSchedulesRepository } from '../repositories/accommodation-pricing-schedules';
import { AccommodationTypesRepository } from '../repositories/accommodation-types';
import { AccommodationPricingSchedule } from '../entities/accommodation-pricing-schedule.entity';
import { AccommodationType } from '../entities/accommodation-type.entity';
import { CreateAccommodationPricingScheduleDto } from '../dto/accommodation-pricing-schedules/create-accommodation-pricing-schedule.dto';
import { UpdateAccommodationPricingScheduleDto } from '../dto/accommodation-pricing-schedules/update-accommodation-pricing-schedule.dto';

describe('AccommodationPricingSchedulesService', () => {
  let service: AccommodationPricingSchedulesService;
  let pricingSchedulesRepository: jest.Mocked<AccommodationPricingSchedulesRepository>;
  let accommodationTypesRepository: jest.Mocked<AccommodationTypesRepository>;

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

  const mockPricingSchedule: AccommodationPricingSchedule = {
    id: 'pricing-schedule-id',
    accommodationTypeId: 'accommodation-type-id',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    price: 150.5,
    createdAt: new Date(),
    updatedAt: new Date(),
    accommodationType: mockAccommodationType,
  };

  const mockPricingSchedulesRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findByAccommodationTypeIdAndHostId: jest.fn(),
    remove: jest.fn(),
  };

  const mockAccommodationTypesRepository = {
    findByIdAndHostId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccommodationPricingSchedulesService,
        {
          provide: AccommodationPricingSchedulesRepository,
          useValue: mockPricingSchedulesRepository,
        },
        {
          provide: AccommodationTypesRepository,
          useValue: mockAccommodationTypesRepository,
        },
      ],
    }).compile();

    service = module.get<AccommodationPricingSchedulesService>(
      AccommodationPricingSchedulesService
    );
    pricingSchedulesRepository = module.get(AccommodationPricingSchedulesRepository);
    accommodationTypesRepository = module.get(AccommodationTypesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a pricing schedule', async () => {
      const createDto: CreateAccommodationPricingScheduleDto = {
        accommodationTypeId: 'accommodation-type-id',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        price: 150.5,
      };

      mockAccommodationTypesRepository.findByIdAndHostId.mockResolvedValue(mockAccommodationType);
      mockPricingSchedulesRepository.create.mockReturnValue(mockPricingSchedule);
      mockPricingSchedulesRepository.save.mockResolvedValue(mockPricingSchedule);

      const result = await service.create('host-id', createDto);

      expect(accommodationTypesRepository.findByIdAndHostId).toHaveBeenCalledWith(
        'accommodation-type-id',
        'host-id'
      );
      expect(pricingSchedulesRepository.create).toHaveBeenCalled();
      expect(pricingSchedulesRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockPricingSchedule);
    });

    it('should throw NotFoundException when accommodation type not found', async () => {
      const createDto: CreateAccommodationPricingScheduleDto = {
        accommodationTypeId: 'accommodation-type-id',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        price: 150.5,
      };

      mockAccommodationTypesRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(service.create('host-id', createDto)).rejects.toThrow(NotFoundException);
      await expect(service.create('host-id', createDto)).rejects.toThrow(
        'Tipo de acomodação não encontrado'
      );
    });

    it('should throw BadRequestException when endDate is not after startDate', async () => {
      const createDto: CreateAccommodationPricingScheduleDto = {
        accommodationTypeId: 'accommodation-type-id',
        startDate: '2024-01-31',
        endDate: '2024-01-01',
        price: 150.5,
      };

      mockAccommodationTypesRepository.findByIdAndHostId.mockResolvedValue(mockAccommodationType);

      await expect(service.create('host-id', createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create('host-id', createDto)).rejects.toThrow(
        'Data de término deve ser posterior à data de início'
      );
    });

    it('should throw BadRequestException when endDate equals startDate', async () => {
      const createDto: CreateAccommodationPricingScheduleDto = {
        accommodationTypeId: 'accommodation-type-id',
        startDate: '2024-01-01',
        endDate: '2024-01-01',
        price: 150.5,
      };

      mockAccommodationTypesRepository.findByIdAndHostId.mockResolvedValue(mockAccommodationType);

      await expect(service.create('host-id', createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllByAccommodationType', () => {
    it('should return all pricing schedules for an accommodation type', async () => {
      const pricingSchedules = [mockPricingSchedule];
      mockAccommodationTypesRepository.findByIdAndHostId.mockResolvedValue(mockAccommodationType);
      mockPricingSchedulesRepository.findByAccommodationTypeIdAndHostId.mockResolvedValue(
        pricingSchedules
      );

      const result = await service.findAllByAccommodationType('host-id', 'accommodation-type-id');

      expect(accommodationTypesRepository.findByIdAndHostId).toHaveBeenCalledWith(
        'accommodation-type-id',
        'host-id'
      );
      expect(pricingSchedulesRepository.findByAccommodationTypeIdAndHostId).toHaveBeenCalledWith(
        'accommodation-type-id',
        'host-id'
      );
      expect(result).toEqual(pricingSchedules);
    });

    it('should throw NotFoundException when accommodation type not found', async () => {
      mockAccommodationTypesRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(
        service.findAllByAccommodationType('host-id', 'accommodation-type-id')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a pricing schedule when found', async () => {
      mockPricingSchedulesRepository.findById.mockResolvedValue(mockPricingSchedule);

      const result = await service.findOne('pricing-schedule-id');

      expect(pricingSchedulesRepository.findById).toHaveBeenCalledWith('pricing-schedule-id');
      expect(result).toEqual(mockPricingSchedule);
    });

    it('should throw NotFoundException when pricing schedule not found', async () => {
      mockPricingSchedulesRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('pricing-schedule-id')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('pricing-schedule-id')).rejects.toThrow(
        'Cronograma de preços não encontrado'
      );
    });
  });

  describe('update', () => {
    it('should update a pricing schedule', async () => {
      const updateDto: UpdateAccommodationPricingScheduleDto = {
        price: 200.0,
      };

      mockPricingSchedulesRepository.findById.mockResolvedValue(mockPricingSchedule);
      mockPricingSchedulesRepository.save.mockResolvedValue({
        ...mockPricingSchedule,
        price: 200.0,
      });

      const result = await service.update('host-id', 'pricing-schedule-id', updateDto);

      expect(pricingSchedulesRepository.findById).toHaveBeenCalledWith('pricing-schedule-id');
      expect(pricingSchedulesRepository.save).toHaveBeenCalled();
      expect(result.price).toBe(200.0);
    });

    it('should validate accommodation type when updating accommodationTypeId', async () => {
      const updateDto: UpdateAccommodationPricingScheduleDto = {
        accommodationTypeId: 'new-accommodation-type-id',
      };

      mockPricingSchedulesRepository.findById.mockResolvedValue(mockPricingSchedule);
      mockAccommodationTypesRepository.findByIdAndHostId.mockResolvedValue(mockAccommodationType);
      mockPricingSchedulesRepository.save.mockResolvedValue(mockPricingSchedule);

      await service.update('host-id', 'pricing-schedule-id', updateDto);

      expect(accommodationTypesRepository.findByIdAndHostId).toHaveBeenCalledWith(
        'new-accommodation-type-id',
        'host-id'
      );
    });

    it('should throw NotFoundException when accommodation type not found on update', async () => {
      const updateDto: UpdateAccommodationPricingScheduleDto = {
        accommodationTypeId: 'new-accommodation-type-id',
      };

      mockPricingSchedulesRepository.findById.mockResolvedValue(mockPricingSchedule);
      mockAccommodationTypesRepository.findByIdAndHostId.mockResolvedValue(null);

      await expect(service.update('host-id', 'pricing-schedule-id', updateDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should validate dates when both are provided', async () => {
      const updateDto: UpdateAccommodationPricingScheduleDto = {
        startDate: '2024-02-01',
        endDate: '2024-01-31',
      };

      mockPricingSchedulesRepository.findById.mockResolvedValue(mockPricingSchedule);

      await expect(service.update('host-id', 'pricing-schedule-id', updateDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.update('host-id', 'pricing-schedule-id', updateDto)).rejects.toThrow(
        'Data de término deve ser posterior à data de início'
      );
    });
  });

  describe('remove', () => {
    it('should remove a pricing schedule', async () => {
      mockPricingSchedulesRepository.findById.mockResolvedValue(mockPricingSchedule);
      mockPricingSchedulesRepository.remove.mockResolvedValue(undefined);

      await service.remove('pricing-schedule-id');

      expect(pricingSchedulesRepository.findById).toHaveBeenCalledWith('pricing-schedule-id');
      expect(pricingSchedulesRepository.remove).toHaveBeenCalledWith(mockPricingSchedule);
    });

    it('should throw NotFoundException when pricing schedule not found', async () => {
      mockPricingSchedulesRepository.findById.mockResolvedValue(null);

      await expect(service.remove('pricing-schedule-id')).rejects.toThrow(NotFoundException);
    });
  });
});

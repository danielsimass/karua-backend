import { Test, TestingModule } from '@nestjs/testing';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';

describe('HostsController', () => {
  let controller: HostsController;
  let service: jest.Mocked<HostsService>;

  const mockService = {
    create: jest.fn(),
    findByHostId: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HostsController],
      providers: [
        {
          provide: HostsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<HostsController>(HostsController);
    service = module.get(HostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

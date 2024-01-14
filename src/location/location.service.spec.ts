import { Test, TestingModule } from '@nestjs/testing';
import { LocationModuleService } from './location.service';

describe('LocationModuleService', () => {
  let service: LocationModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationModuleService],
    }).compile();

    service = module.get<LocationModuleService>(LocationModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

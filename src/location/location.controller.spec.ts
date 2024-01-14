import { Test, TestingModule } from '@nestjs/testing';
import { LocationModuleController } from './location.controller';
import { LocationModuleService } from './location.service';

describe('LocationModuleController', () => {
  let controller: LocationModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationModuleController],
      providers: [LocationModuleService],
    }).compile();

    controller = module.get<LocationModuleController>(LocationModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

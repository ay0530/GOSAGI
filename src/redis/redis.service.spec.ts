import { RedisCoreService } from 'src/redis/redis-core.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('RedisCoreService', () => {
  let service: RedisCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisCoreService],
    }).compile();

    service = module.get<RedisCoreService>(RedisCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProductContentService } from './product.content.service';

describe('ProductContentService', () => {
  let service: ProductContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductContentService],
    }).compile();

    service = module.get<ProductContentService>(ProductContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

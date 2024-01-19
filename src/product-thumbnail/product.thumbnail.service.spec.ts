import { Test, TestingModule } from '@nestjs/testing';
import { ProductThumbnailService } from './product.thumbnail.service';

describe('ProductThumbnailService', () => {
  let service: ProductThumbnailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductThumbnailService],
    }).compile();

    service = module.get<ProductThumbnailService>(ProductThumbnailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

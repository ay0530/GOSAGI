import { Test, TestingModule } from '@nestjs/testing';
import { ProductThumbnailController } from './product-thumbnail.controller';
import { ProductThumbnailService } from './product-thumbnail.service';

describe('ProductThumbnailController', () => {
  let controller: ProductThumbnailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductThumbnailController],
      providers: [ProductThumbnailService],
    }).compile();

    controller = module.get<ProductThumbnailController>(ProductThumbnailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

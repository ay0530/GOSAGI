import { Test, TestingModule } from '@nestjs/testing';
import { ProductContentController } from './product-content.controller';
import { ProductContentService } from './product-content.service';

describe('ProductContentController', () => {
  let controller: ProductContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductContentController],
      providers: [ProductContentService],
    }).compile();

    controller = module.get<ProductContentController>(ProductContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

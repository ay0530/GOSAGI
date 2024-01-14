import { Module } from '@nestjs/common';
import { ProductContentService } from './product-content.service';
import { ProductContentController } from './product-content.controller';

@Module({
  controllers: [ProductContentController],
  providers: [ProductContentService],
})
export class ProductContentModule {}

import { Module } from '@nestjs/common';
import { ProductThumbnailService } from './product.thumbnail.service';
import { ProductThumbnailController } from './product.thumbnail.controller';

@Module({
  controllers: [ProductThumbnailController],
  providers: [ProductThumbnailService],
})
export class ProductThumbnailModule {}

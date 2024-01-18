import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductThumbnail } from './entities/product-thumbnail.entity';
import { ProductContent } from './entities/product-content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductThumbnail, ProductContent]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}

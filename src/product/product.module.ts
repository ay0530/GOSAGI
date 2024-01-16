import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductThumbnail } from './entities/product-thumbnail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductThumbnail])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

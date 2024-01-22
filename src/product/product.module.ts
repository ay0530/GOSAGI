import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtCommonModule } from 'src/common/jwt.common.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { ProductThumbnail } from './entities/product-thumbnail.entity';
import { ProductContent } from './entities/product-content.entity';

@Module({
  imports: [
    JwtCommonModule,
    TypeOrmModule.forFeature([Product, ProductThumbnail, ProductContent]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}

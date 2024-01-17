import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { JwtCommonModule } from 'src/common/jwt.common.module';

@Module({
  imports: [JwtCommonModule, TypeOrmModule.forFeature([Cart, Product])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}

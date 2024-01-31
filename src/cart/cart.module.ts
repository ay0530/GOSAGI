import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { JwtCommonModule } from 'src/common/jwt.common.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [JwtCommonModule, TypeOrmModule.forFeature([Cart]), ProductModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}

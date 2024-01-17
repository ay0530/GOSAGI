import { Module } from '@nestjs/common';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import { Wish } from './entities/wish.entity';
import { Product } from 'src/product/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtCommonModule } from 'src/common/jwt.common.module';

@Module({
  imports: [JwtCommonModule, TypeOrmModule.forFeature([Wish, Product])],
  controllers: [WishController],
  providers: [WishService],
  exports: [WishService],
})
export class WishModule {}

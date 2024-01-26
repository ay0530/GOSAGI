import { Module } from '@nestjs/common';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import { Wish } from './entities/wish.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtCommonModule } from 'src/common/jwt.common.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [JwtCommonModule, TypeOrmModule.forFeature([Wish]), ProductModule],
  controllers: [WishController],
  providers: [WishService],
  exports: [WishService],
})
export class WishModule {}

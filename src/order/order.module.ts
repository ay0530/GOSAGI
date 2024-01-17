import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { JwtCommonModule } from 'src/common/jwt.common.module';

@Module({
  imports: [JwtCommonModule, TypeOrmModule.forFeature([Order, Product, User])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}

import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { JwtCommonModule } from 'src/common/jwt.common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [JwtCommonModule, TypeOrmModule.forFeature([Review]), OrderModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}

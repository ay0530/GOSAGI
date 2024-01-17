import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtCommonModule } from 'src/common/jwt.common.module';
import { ProductModule } from 'src/product/product.module';
import { AnswerModule } from 'src/answer/answer.module';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';

@Module({
  imports: [
    JwtCommonModule,
    AnswerModule,
    ProductModule,
    TypeOrmModule.forFeature([Question]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionModule],
})
export class QuestionModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtCommonModule } from 'src/common/jwt.common.module';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';

@Module({
  imports: [JwtCommonModule, TypeOrmModule.forFeature([Question])],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [TypeOrmModule.forFeature([Question])],
})
export class QuestionModule {}

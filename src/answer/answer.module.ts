import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtCommonModule } from 'src/common/jwt.common.module';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { Answer } from './entities/answer.entity';

@Module({
  imports: [JwtCommonModule, TypeOrmModule.forFeature([Answer])],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}

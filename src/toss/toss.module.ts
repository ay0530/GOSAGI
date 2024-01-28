import { Module } from '@nestjs/common';

import { TossController } from './toss.controller';
import { TossService } from './toss.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TossController],
  providers: [TossService],
})
export class TossModule {}

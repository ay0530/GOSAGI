import { Module } from '@nestjs/common';
import { LocationModuleService } from './location.service';
import { LocationModuleController } from './location.controller';

@Module({
  controllers: [LocationModuleController],
  providers: [LocationModuleService],
})
export class LocationModule {}

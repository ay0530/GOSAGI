import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { JwtCommonModule } from 'src/common/jwt.common.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';

@Module({
  imports: [JwtCommonModule, ConfigModule, TypeOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}

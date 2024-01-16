import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtCommonModule } from 'src/common/jwt.common.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';

@Module({
  imports: [JwtCommonModule, TypeOrmModule.forFeature([Store])],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [TypeOrmModule.forFeature([Store])],
})
export class StoreModule {}

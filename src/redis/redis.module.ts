import { Module } from '@nestjs/common';

import { RedisCoreService } from './redis-core.service';
import { RedisJwtService } from './redis-jwt.service';
import { RedisViewsService } from './redis-views.service';

// redis.module.ts
@Module({
  providers: [RedisCoreService, RedisJwtService, RedisViewsService],
  exports: [RedisCoreService, RedisJwtService, RedisViewsService],
})
export class RedisModule {}

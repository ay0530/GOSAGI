import { Module } from '@nestjs/common';

import { RedisCoreService } from './redis-core.service';
import { RedisJwtService } from './redis-jwt.service';
import { RedisViewsService } from './redis-views.service';
import { RedisImageService } from './redis-logo.service';

// redis.module.ts
@Module({
  providers: [
    RedisCoreService,
    RedisJwtService,
    RedisViewsService,
    RedisImageService,
  ],
  exports: [
    RedisCoreService,
    RedisJwtService,
    RedisViewsService,
    RedisImageService,
  ],
})
export class RedisModule {}

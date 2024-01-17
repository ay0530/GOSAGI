import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtCommonModule } from 'src/common/jwt.common.module';

import { UserModule } from 'src/user/user.module';
import { RedisModule } from 'src/redis/redis.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtCommonModule,
    UserModule,
    RedisModule,
  ],
  providers: [AuthService, JwtAuthGuard],
  exports: [PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from 'src/user/user.module';
import { RedisModule } from 'src/redis/redis.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
// import { GoogleStrategy } from 'src/strategies/google-strategy';
import { JwtNaverStrategy } from 'src/strategies/naver-strategy';
import { JwtGoogleStrategy } from 'src/strategies/google-strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
  ],
  providers: [AuthService, JwtAuthGuard, JwtNaverStrategy, JwtGoogleStrategy],
  exports: [PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}

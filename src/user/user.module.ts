import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { RedisModule } from 'src/redis/redis.module';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    RedisModule,
  ],
  providers: [UserService, JwtAuthGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

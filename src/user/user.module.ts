import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthGuard } from 'src/guards/jwt.guard';

import { JwtCommonModule } from 'src/common/jwt.common.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Module({
  imports: [JwtCommonModule, TypeOrmModule.forFeature([User])],
  providers: [UserService, JwtAuthGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

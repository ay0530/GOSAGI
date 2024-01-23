import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtCommonModule } from 'src/common/jwt.common.module';
import { Address } from './entities/address.entity';

@Module({
  imports: [JwtCommonModule, TypeOrmModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}

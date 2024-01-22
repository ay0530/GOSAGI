import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Address } from './entities/address.entity';
import { ApiQuery } from '@nestjs/swagger';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  // 배송지 등록
  async createAddress(createAddressDto: CreateAddressDto, userId: number) {
    const address = await this.addressRepository.save({
      user_id: userId,
      createAddressDto,
    });
    return address;
  }

  // 배송지 조회
  async getAddress() {
    const getAddress = await this.addressRepository.find();
    return getAddress;
  }

  // 배송지 상세조회
  async getOneAddress(id: number, userId: number) {
    const getOneAddress = await this.addressRepository.findOne({
      where: { id },
    });
    return getOneAddress;
  }

  // 배송지 수정
  async updateAddress(
    id: number,
    updateAddressDto: UpdateAddressDto,
    userId: number,
  ) {
    const existAddress = await this.addressRepository.findOne({
      where: { id },
    });
    if (!existAddress) {
      throw new NotFoundException('배송지가 존재하지 않습니다.');
    }

    await this.addressRepository.update(
      { id, user_id: userId },
      updateAddressDto,
    );
    return updateAddressDto;
  }

  // 배송지 삭제
  async deleteAddress(id: number, userId: number) {
    const existAddress = await this.addressRepository.findOne({
      where: { id },
    });
    if (!existAddress) {
      throw new NotFoundException('배송지가 존재하지 않습니다.');
    }

    await this.addressRepository.delete({ id, user_id: userId });
  }
}

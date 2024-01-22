import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ResponseDto } from 'src/ResponseDTO/response-dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // 배송지 등록
  @Post()
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @Req() req: any,
  ) {
    const data = await this.addressService.createAddress(
      createAddressDto,
      req.user.id,
    );

    const response = new ResponseDto(
      true,
      '배송지 등록이 완료되었습니다.',
      data,
    );
    return response;
  }

  // 배송지 조회
  @Get()
  async getAddress() {
    const data = await this.addressService.getAddress();

    const response = new ResponseDto(
      true,
      '배송지 조회가 완료되었습니다.',
      data,
    );
    return response;
  }

  // 배송지 상세조회
  @Get(':id')
  async getOneAddress(@Param('id') id: string, @Req() req: any) {
    const data = await this.addressService.getOneAddress(+id, req.user.id);

    const response = new ResponseDto(
      true,
      '배송지 상세조회가 완료되었습니다.',
      data,
    );
    return response;
  }

  // 배송지 수정
  @Patch(':id')
  async updateAddress(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req: any,
  ) {
    const data = await this.addressService.updateAddress(
      +id,
      updateAddressDto,
      req.user.id,
    );

    const response = new ResponseDto(
      true,
      '배송지 수정이 완료되었습니다.',
      data,
    );
    return response;
  }

  // 배송지 삭제
  @Delete(':id')
  async deleteAddress(@Param('id') id: string, @Req() req: any) {
    const data = await this.addressService.deleteAddress(+id, req.user.id);
    const response = new ResponseDto(
      true,
      '배송지 삭제가 완료되었습니다.',
      null,
    );
    return response;
  }
}

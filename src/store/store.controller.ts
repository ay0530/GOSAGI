import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ResponseDto } from 'src/ResponseDTO/response-dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/user/types/userRole.type';
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // 매장 정보 저장
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Post()
  async create(@Body() createStoreDto: CreateStoreDto, @Req() req: any) {
    const data = await this.storeService.create(createStoreDto, req.user.id);

    const response = new ResponseDto(
      true,
      '매장 정보 등록이 완료되었습니다',
      data,
    );
    return response;
  }

  // 매장 정보 상세 조회
  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.storeService.findOne(+id);

    const response = new ResponseDto(
      true,
      '매장 정보 조회가 완료되었습니다',
      data,
    );
    return response;
  }

  // 매장 정보 수정
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
    @Req() req: any,
  ) {
    const data = await this.storeService.update(
      id,
      updateStoreDto,
      req.user.id,
    );

    const response = new ResponseDto(
      true,
      '매장 정보 수정이 완료되었습니다',
      data,
    );
    return response;
  }

  // 매장 정보 삭제
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.storeService.remove(+id, req.user.id);

    const response = new ResponseDto(
      true,
      '매장 정보 삭제가 완료되었습니다',
      null,
    );
    return response;
  }

  // 매장 목록 조회
  @Get('list')
  async findAll() {
    const data = await this.storeService.findAll();

    const response = new ResponseDto(
      true,
      '매장 목록 조회가 완료되었습니다',
      data,
    );
    return response;
  }

  // 매장 목록 검색 조회
  @UseGuards(JwtAuthGuard)
  @Get('list/:category/:keyword')
  async searchAll(
    @Param('category') category: string,
    @Param('keyword') keyword: string,
  ) {
    const data = await this.storeService.searchAll(category, keyword);

    const response = new ResponseDto(true, '검색이 완료되었습니다', data);
    return response;
  }

  // 매장 상품 조회
  @UseGuards(JwtAuthGuard)
  @Get('productList/:storeId')
  async findProductAll(@Param('storeId') storeId: number) {
    const data = await this.storeService.findProductAll(storeId);

    const response = new ResponseDto(true, '검색이 완료되었습니다', data);
    return response;
  }

  // 매장 상품 검색 조회
  @UseGuards(JwtAuthGuard)
  @Get('productList/:storeId/:category/:keyword')
  async searchProductAll(
    @Param('storeId') storeId: number,
    @Param('category') category: string,
    @Param('keyword') keyword: string,
  ) {
    const data = await this.storeService.searchProductAll(
      storeId,
      category,
      keyword,
    );

    const response = new ResponseDto(true, '검색이 완료되었습니다', data);
    return response;
  }
}

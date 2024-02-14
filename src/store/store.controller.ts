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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileInterceptor,
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Express } from 'express';
import * as AWS from 'aws-sdk';
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
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() req: any,
    @Body() createStoreDto: CreateStoreDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileName = file.originalname;
    const ext = file.originalname.split('.').pop();

    const data = await this.storeService.create(
      createStoreDto,
      req.user.id,
      fileName,
      file,
      ext,
    );

    const response = new ResponseDto(
      true,
      '매장 정보 등록 신청이 완료되었습니다',
      data,
    );
    return response;
  }
  catch(error) {
    console.log(error);
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

  // 신청취소
  @UseGuards(JwtAuthGuard)
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

  // 신청중인 셀러 조회
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('approve')
  async findAppliedSeller() {
    const data = await this.storeService.findAppliedSeller();

    const response = new ResponseDto(true, '신청한 사업자 조회 성공', data);
    return response;
  }

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
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ResponseDto } from 'src/ResponseDTO/response-dto';

@Controller('wish')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  //찜하기
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createWishDto: CreateWishDto, @Req() req) {
    const data = await this.wishService.create(createWishDto, req.user);
    const response = new ResponseDto(true, '찜이 완료되었습니다.', data);
    return response;
  }

  //내가 찜한 상품 전체 보기
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req) {
    const data = await this.wishService.findAll(req.user);
    const response = new ResponseDto(
      true,
      '찜을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  //상품별 찜 보기
  @UseGuards(JwtAuthGuard)
  @Get('/mine/:productId')
  async findIsMyWish(@Param('productId') id: number, @Req() req) {
    const data = await this.wishService.findIsMyWish(id, req.user);
    const response = new ResponseDto(
      true,
      '찜을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  //걍 찜 보기
  @Get('/count/:productId')
  async findWishCountByProduct(@Param('productId') id: number) {
    const data = await this.wishService.findWishCountByProduct(id);
    const response = new ResponseDto(
      true,
      '찜을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  //찜 취소
  @UseGuards(JwtAuthGuard)
  @Delete('/login/:wishId')
  async remove(@Param('wishId') id: number, @Req() req) {
    const data = await this.wishService.remove(id, req.user);
    const response = new ResponseDto(
      true,
      '찜을 정상적으로 삭제했습니다.',
      data,
    );
    return response;
  }
}

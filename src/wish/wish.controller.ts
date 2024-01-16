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
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';


@Controller('wish')
export class WishController {
  constructor(private readonly wishService: WishService) {}

  //찜하기
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    const user = req.user;
    return this.wishService.create(createWishDto, user);
  }

  //내가 찜한 상품 전체 보기 
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    const user = req.user;
    return this.wishService.findAll(user);
  }

  //상품별 찜 보기
  @Get(':productId')
  findByProduct(@Param('productId') id: string) {
    return this.wishService.findByProduct(+id);
  }

  //찜 취소
  @UseGuards(JwtAuthGuard)
  @Delete(':wishid')
  remove(@Param('wishid') id: string, @Req() req) {
    const user = req.user;
    return this.wishService.remove(+id, user);
  }
}

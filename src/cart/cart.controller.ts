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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ResponseDto } from 'src/ResponseDTO/response-dto';
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(@Body() createCartDto: CreateCartDto, @Req() req) {
    const data = await this.cartService.create(createCartDto, req.user);
    const response = new ResponseDto(
      true,
      '카트에 상품이 등록되었습니다.',
      data,
    );
    return response;
  }

  @Get()
  async findAll(@Req() req) {
    const data = await this.cartService.findAll(req.user);

    const response = new ResponseDto(
      true,
      '장바구니 상품을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req) {
    const data = await this.cartService.findOne(id, req.user);
    const response = new ResponseDto(
      true,
      '장바구니 상품을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCartDto: UpdateCartDto,
    @Req() req,
  ) {
    const data = await this.cartService.update(id, updateCartDto, req.user);
    const response = new ResponseDto(
      true,
      '카트에 있는 해당 상품의 수량이 변경되었습니다.',
      data,
    );
    return response;
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    const data = await this.cartService.remove(id, req.user);
    const response = new ResponseDto(
      true,
      '장바구니에서 해당 상품을 정상적으로 삭제했습니다.',
      data,
    );
    return response;
  }
}

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

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @Req() req) {
    const user = req.user;
    return this.cartService.create(createCartDto, user);
  }

  @Get()
  findAll(@Req() req) {
    const user = req.user;
    return this.cartService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.cartService.findOne(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto, @Req() req) {
    const user = req.user;
    return this.cartService.update(+id, updateCartDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.cartService.remove(+id, user);
  }
}

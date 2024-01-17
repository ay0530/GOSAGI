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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const user = req.user;
    return this.orderService.create(createOrderDto, user);
  }

  @Get()
  findAll(@Req() req) {
    const user = req.user;
    return this.orderService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.orderService.findOne(+id, user);
  }

  // @Patch(':id')
  // updatebyUser(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Req() req) {
  //   const user = req.user;
  //   return this.orderService.update(+id, updateOrderDto, user);
  // }

  @Patch(':id')
  refundComplete(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Req() req) {
    const user = req.user;
    return this.orderService.refundComplete(+id, updateOrderDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.orderService.remove(+id, user);
  }
}

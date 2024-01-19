import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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

  //구매 신청 = 입금 전
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

  //입금 완료, 상품 준비 중, 배송 중, 배송 완료 -> admin
  //admin인지 확인하는 가드 추후 생성
  @Patch('/manage/:id')
  adminUpdate(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.adminUpdate(id, updateOrderDto);
  }

  //구매 확정 -> user
  @Patch('/confirm/:id')
  confirmUpdate(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    const user = req.user;
    return this.orderService.confirmUpdate(id, updateOrderDto, user);
  }
  //환불 신청 -> user
  @Patch('/refund/:id')
  refundRequest(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    const user = req.user;
    return this.orderService.refundRequest(id, updateOrderDto, user);
  }
  //환불 완료
  @Patch('/manage/refund/:id')
  refundComplete(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    const user = req.user;
    return this.orderService.refundComplete(id, updateOrderDto, user);
  }
}

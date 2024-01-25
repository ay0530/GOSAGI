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
import { UpdateOrderDeliveryDto } from './dto/update-order-delivery.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/user/types/userRole.type';
@UseGuards(JwtAuthGuard, RolesGuard)
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
  findAllByUser(@Req() req) {
    const user = req.user;
    return this.orderService.findAllByUser(user);
  }

  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Get('/product/:productId')
  findAllByProduct(@Param('productId') productId: number) {
    return this.orderService.findAllByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Req() req) {
    const user = req.user;
    return this.orderService.findOne(id, user);
  }

  //배송지 변경
  @Roles(UserRole.USER)
  @Patch('/address/:id')
  updateAddress(@Param('id') id: number, @Body() updateOrderDeliveryDto: UpdateOrderDeliveryDto, @Req() req,) {
    const user = req.user;
    return this.orderService.updateAddress(id, updateOrderDeliveryDto, user);
  }

  //입금완료, 배송준비, 배송중, 배송완료 -> admin
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Patch('/manage/:id')
  updateAdmin(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateAdmin(id, updateOrderDto);
  }

  //구매 확정 -> user
  @Roles(UserRole.USER)
  @Patch('/confirm/:id')
  updateConfirm(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    const user = req.user;
    return this.orderService.updateConfirm(id, updateOrderDto, user);
  }
  //환불 신청 -> user
  @Roles(UserRole.USER)
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
  @Roles(UserRole.SELLER, UserRole.ADMIN)
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

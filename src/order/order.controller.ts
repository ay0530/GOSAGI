import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
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
import { ResponseDto } from 'src/ResponseDTO/response-dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //구매 신청 = 입금 대기
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const data = await this.orderService.create(createOrderDto, req.user);
    const response = new ResponseDto(true, '구매에 성공하였습니다.', data);
    return response;
  }

  @Get()
  async findAllByUser(@Req() req) {
    const data = await this.orderService.findAllByUser(req.user);
    const response = new ResponseDto(
      true,
      '구매 내역을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Get('/product/:productId')
  async findAllByProduct(@Param('productId') productId: number) {
    const data = await this.orderService.findAllByProduct(productId);
    const response = new ResponseDto(
      true,
      '구매 내역을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  //기간별 조회
  @Get('/period')
  async findAllByUserPeriod(@Query('period') period: string, @Req() req) {
    const data = await this.orderService.findAllByUserPeriod(period, req.user);
    const response = new ResponseDto(
      true,
      '구매 내역을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  //상태별 조회
  @Get('/status')
  async findAllByUserStatus(@Query('status') status: string, @Req() req) {
    const data = await this.orderService.findAllByUserStatus(status, req.user);
    const response = new ResponseDto(
      true,
      '구매 내역을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req) {
    const data = await this.orderService.findOne(id, req.user);
    const response = new ResponseDto(
      true,
      '구매 내역을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  //배송지 변경
  @Roles(UserRole.USER)
  @Patch('/address/:id')
  async updateAddress(
    @Param('id') id: number,
    @Body() updateOrderDeliveryDto: UpdateOrderDeliveryDto,
    @Req() req,
  ) {
    const data = await this.orderService.updateAddress(
      id,
      updateOrderDeliveryDto,
      req.user,
    );
    const response = new ResponseDto(true, '배송지가 변경되었습니다.', data);
    return response;
  }

  //입금완료, 배송준비, 배송중, 배송완료 -> admin
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Patch('/manage/:id')
  async updateAdmin(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const data = await this.orderService.updateAdmin(id, updateOrderDto);
    const response = new ResponseDto(true, '상태가 변경되었습니다.', data);
    return response;
  }

  //구매 확정 -> user
  @Roles(UserRole.USER)
  @Patch('/confirm/:id')
  async updateConfirm(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    const data = await this.orderService.updateConfirm(
      id,
      updateOrderDto,
      req.user,
    );
    const response = new ResponseDto(
      true,
      '구매 확정이 완료되었습니다. 리뷰를 작성할 수 있습니다.',
      data,
    );
    return response;
  }

  //환불 신청 -> user
  @Roles(UserRole.USER)
  @Patch('/refund/:id')
  async refundRequest(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    const data = await this.orderService.refundRequest(
      id,
      updateOrderDto,
      req.user,
    );
    const response = new ResponseDto(
      true,
      '정상적으로 환불을 신청했습니다.',
      data,
    );
    return response;
  }

  //환불 완료
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Patch('/manage/refund/:id')
  async refundComplete(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    const data = await this.orderService.refundComplete(
      id,
      updateOrderDto,
      req.user,
    );
    const response = new ResponseDto(
      true,
      '성공적으로 환불에 성공하였습니다.',
      data,
    );
    return response;
  }
}

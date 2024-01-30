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
import { CreateReturnDto } from './dto/create-return-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderDeliveryDto } from './dto/update-order-delivery.dto';
import { SearchOrderPeriodDto } from './dto/search-order-period.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/user/types/userRole.type';
import { ResponseDto } from 'src/ResponseDTO/response-dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //구매
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const data = await this.orderService.createOrder(createOrderDto, req.user);
    const response = new ResponseDto(true, '구매에 성공하였습니다.', data);
    return response;
  }

  //반품
  @Post('/return/:id')
  async createReturn(
    @Param('id') id: number,
    @Body() createReturnDto: CreateReturnDto,
    @Req() req,
  ) {
    const data = await this.orderService.createReturn(
      id,
      createReturnDto,
      req.user,
    );
    const response = new ResponseDto(true, '반품에 성공하였습니다.', data);
    return response;
  }

  //교환
  @Post('/exchange/:id')
  async createExchange(
    @Param('id') id: number,
    @Body() createExchangeDto: CreateOrderDto,
    @Req() req,
  ) {
    const data = await this.orderService.createExchange(
      id,
      createExchangeDto,
      req.user,
    );
    const response = new ResponseDto(true, '교환 신청에 성공하였습니다.', data);
    return response;
  }

  //주문한 order 전부 불러오기 - 기간 별 조회, 상태 별 조회 포함 - 결제 완료, 배송중, 배송완료, 구매확정
  @Get()
  async findAllOrderByUser(
    @Req() req: any,
    @Query('status') status?: number,
    @Query('period') period?: string,
  ) {
    const data = await this.orderService.findAllOrderByUser(
      req.user,
      status,
      period,
    );
    const response = new ResponseDto(
      true,
      '구매 내역을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  @Get('/period')
  async findAllOrderByUserSearchPeriod(
    @Req() req: any,
    @Body() searchOrderPeriodDto: SearchOrderPeriodDto,
    @Query('status') status?: number,
  ) {
    const data = await this.orderService.findAllOrderByUserSearchPeriod(
      req.user,
      searchOrderPeriodDto,
      status,
    );
    const response = new ResponseDto(
      true,
      '구매 내역을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  // 취소한 order 불러오기 - 환불, 반품 신청, 반품 완료
  @Get('/return')
  async findAllReturnByUser(
    @Req() req: any,
    @Query('status') status?: number,
    @Query('period') period?: string,
  ) {
    const data = await this.orderService.findAllReturnByUser(
      req.user,
      status,
      period,
    );
    const response = new ResponseDto(
      true,
      '구매 내역을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  //상품 별 order 전부 불러오기
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

  // 주문 상세 정보
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

  //배송중, 배송완료 -> admin
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Patch('/manage/:id')
  async updateAdmin(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const data = await this.orderService.updateAdmin(id, updateOrderStatusDto);
    const response = new ResponseDto(true, '상태가 변경되었습니다.', data);
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

  //구매 확정 -> user
  @Patch('/confirm/:id')
  async updateConfirm(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Req() req,
  ) {
    const data = await this.orderService.updateConfirm(
      id,
      updateOrderStatusDto,
      req.user,
    );
    const response = new ResponseDto(
      true,
      '구매 확정이 완료되었습니다. 리뷰를 작성할 수 있습니다.',
      data,
    );
    return response;
  }

  //환불
  @Roles(UserRole.USER)
  @Patch('/refund/:id')
  async refundComplete(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Req() req,
  ) {
    const data = await this.orderService.refundComplete(
      id,
      updateOrderStatusDto,
      req.user,
    );
    const response = new ResponseDto(
      true,
      '성공적으로 환불에 성공하였습니다.',
      data,
    );
    return response;
  }

  //반품 완료
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Patch('/manage/return/:id')
  async returnComplete(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const data = await this.orderService.returnComplete(
      id,
      updateOrderStatusDto,
    );
    const response = new ResponseDto(true, '반품 완료 되었습니다.', data);
    return response;
  }
}

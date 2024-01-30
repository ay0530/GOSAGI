import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreateReturnDto } from './dto/create-return-order.dto';
import { OrderStatus } from 'src/order/types/order-status.type';
import { OrderStatusType } from 'src/order/types/order-status.type';
import { Between, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { ProductService } from 'src/product/product.service';
import _ from 'lodash';
import { UpdateOrderDeliveryDto } from './dto/update-order-delivery.dto';
import { SearchOrderPeriodDto } from './dto/search-order-period.dto';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: User) {
    //결제는 다른 api에서 진행하기 때문에 그 후에 결제 완료 상태로 order에 저장한다.

    //해당하는 product의 정보를 가져와 현재 값을 같이 저장한다.

    const {
      product_id,
      receiver,
      status,
      receiver_phone_number,
      delivery_address,
      delivery_address_detail,
      delivery_request,
      quantity,
      post_code,
      toss_order_id,
    } = createOrderDto;
    const product = await this.productService.getProductInfo(product_id);

    //우리 쇼핑몰 구매는 기부 사이트의 point가 아닌 price로 진행함
    //product id는 현재 판매하는 상품으로 연결할 때 사용, name과 price는 변동 가능성 있으니 저장
    const createOrder = await this.orderRepository.save({
      product_id,
      receiver,
      status,
      receiver_phone_number,
      delivery_address,
      delivery_address_detail,
      delivery_request,
      quantity,
      product_name: product.name,
      product_price: product.price,
      product_thumbnail: product.thumbnail_image,
      post_code,
      toss_order_id,
      user_id: user.id,
    });

    return createOrder;
  }

  async createReturn(id: number, createReturnDto: CreateReturnDto, user: User) {
    //배송지가 바뀔 수 있으니 새로 입력받는다.
    const {
      receiver,
      status,
      receiver_phone_number,
      delivery_address,
      delivery_address_detail,
      delivery_request,
      post_code,
      after_service_request,
    } = createReturnDto;
    //해당 user가 id에 해당하는 order의 소유인지 확인하기 위해 user_id도 같이 확인
    const order = await this.orderRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException(
        '해당 상품의 구매 내역을 확인할 수 없습니다.',
      );
    }

    //order의 status 확인 : 배송 완료일 때만 반품 신청 가능
    if (order.status !== OrderStatus.DELIVERY_COMPLETED) {
      throw new BadRequestException(
        '해당 주문은 반품이 불가능합니다. 배송 전이라면 환불을 이용하세요.',
      );
    }

    //반품 신청 맞는지
    if (status !== OrderStatus.RETURN_REQUEST) {
      throw new BadRequestException('잘못된 반품 신청입니다.');
    }

    //기존 order의 status를 반품신청으로 바꾼다.
    order.status = status;

    //입력 받은 내용 업데이트
    order.receiver = receiver;
    order.receiver_phone_number = receiver_phone_number;
    order.delivery_address = delivery_address;
    order.delivery_address_detail = delivery_address_detail;
    order.post_code = post_code;
    order.delivery_request = delivery_request;
    order.after_service_request = after_service_request;

    await this.orderRepository.save(order);

    return order;
  }

  async createExchange(
    id: number,
    createExchangeDto: CreateOrderDto,
    user: User,
  ) {
    const {
      product_id,
      receiver,
      status,
      receiver_phone_number,
      delivery_address,
      delivery_address_detail,
      delivery_request,
      quantity,
      post_code,
      toss_order_id,
      after_service_request,
    } = createExchangeDto;

    //해당 user가 id에 해당하는 order의 소유인지 확인하기 위해 user_id도 같이 확인
    const order = await this.orderRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException(
        '해당 상품의 구매 내역을 확인할 수 없습니다.',
      );
    }

    //order의 status 확인 : 배송 완료일 때만 교환 신청 가능
    if (order.status !== OrderStatus.DELIVERY_COMPLETED) {
      throw new BadRequestException(
        '해당 주문은 반품이 불가능합니다. 배송 전이라면 환불을 이용하세요.',
      );
    }

    //교환 신청 맞는지
    if (status !== OrderStatus.EXCHANGE_REQUEST) {
      throw new BadRequestException('잘못된 교환 신청입니다.');
    }

    //기존 order는 반품으로 처리가 되고 새로 주문하게 되는 인스턴스를 만들어준다.
    order.status = OrderStatus.RETURN_REQUEST;

    //입력 받은 내용 배송지도 업데이트
    order.receiver = receiver;
    order.receiver_phone_number = receiver_phone_number;
    order.delivery_address = delivery_address;
    order.delivery_address_detail = delivery_address_detail;
    order.post_code = post_code;
    order.delivery_request = delivery_request;
    order.after_service_request = after_service_request;

    //update
    await this.orderRepository.save(order);
    //새로 재구매를 제작
    const product = await this.productService.getProductInfo(product_id);

    const createExchange = await this.orderRepository.save({
      product_id,
      receiver,
      status: OrderStatus.PURCHASE_CONFIRM, //새로 구매하는 것으로 제작
      receiver_phone_number,
      delivery_address,
      delivery_address_detail,
      delivery_request,
      quantity,
      product_name: product.name,
      product_price: product.price,
      product_thumbnail: product.thumbnail_image,
      post_code,
      toss_order_id,
      after_service_request,
      user_id: user.id,
    });

    return createExchange;
  }

  async findStartDate(period: string) {
    let startDate = new Date();

    if (period !== undefined) {
      const periodValue = Number(period.replace(/\D/g, ''));
      //period 입력은 7days 1month 등
      if (period.includes('day')) {
        startDate.setDate(startDate.getDate() - periodValue);
      } else if (period.includes('month')) {
        startDate.setMonth(startDate.getMonth() - periodValue);
      } else {
        //다른 이상한 값 역시 default로 전체 값을 보여준다.
        startDate = new Date(0);
      }
    } else {
      //default는 전체 주문을 보여준다.
      startDate = new Date(0);
    }

    return startDate;
  }

  async findAllOrderByUser(user: User, status: number, period: string) {
    const startDate = await this.findStartDate(period);

    //status default는 결제 완료부터 구매 확정까지 보여준다.
    //입력이 있을 시 해당 status만 보여준다.
    const findStatus =
      status !== undefined
        ? [status as OrderStatusType]
        : [
            OrderStatus.PURCHASE_COMPLETED,
            OrderStatus.SHIPPING,
            OrderStatus.DELIVERY_COMPLETED,
            OrderStatus.PURCHASE_CONFIRM,
          ];

    const orders = await this.orderRepository.find({
      where: {
        user_id: user.id,
        status: In(findStatus),
        createdAt: Between(startDate, new Date()),
      },
      order: {
        createdAt: 'DESC', // createdAt을 기준으로 내림차순 정렬
      },
      select: [
        'id',
        'status',
        'product_name',
        'product_price',
        'product_thumbnail',
        'quantity',
        'createdAt',
      ],
    });

    return {
      order_count: orders.length,
      data: orders,
    };
  }

  async findAllOrderByUserSearchPeriod(
    user: User,
    searchOrderPeriodDto: SearchOrderPeriodDto,
    status: number,
  ) {
    const { start_period, end_period } = searchOrderPeriodDto;
    //status default는 결제 완료부터 구매 확정까지 보여준다.
    //입력이 있을 시 해당 status만 보여준다.
    const findStatus =
      status !== undefined
        ? [status as OrderStatusType]
        : [
            OrderStatus.PURCHASE_COMPLETED,
            OrderStatus.SHIPPING,
            OrderStatus.DELIVERY_COMPLETED,
            OrderStatus.PURCHASE_CONFIRM,
          ];

    const orders = await this.orderRepository.find({
      where: {
        user_id: user.id,
        status: In(findStatus),
        createdAt: Between(start_period, end_period),
      },
      order: {
        createdAt: 'DESC', // createdAt을 기준으로 내림차순 정렬
      },
      select: [
        'id',
        'status',
        'product_name',
        'product_price',
        'product_thumbnail',
        'quantity',
        'createdAt',
      ],
    });

    return {
      order_count: orders.length,
      data: orders,
    };
  }

  async findAllReturnByUser(user: User, status: number, period: string) {
    const startDate = await this.findStartDate(period);

    //status default는 반품 신청 내역만 보여준다.
    //입력이 있을 시 해당 status만 보여준다.
    const findStatus =
      status !== undefined
        ? [status as OrderStatusType]
        : [
            OrderStatus.REFUND_COMPLETED,
            OrderStatus.RETURN_REQUEST,
            OrderStatus.RETURN_COMPLETED,
          ];

    const orders = await this.orderRepository.find({
      where: {
        user_id: user.id,
        status: In(findStatus),
        createdAt: Between(startDate, new Date()),
      },
      order: {
        createdAt: 'DESC', // createdAt을 기준으로 내림차순 정렬
      },
      select: [
        'id',
        'status',
        'product_name',
        'product_price',
        'product_thumbnail',
        'quantity',
        'createdAt',
      ],
    });

    return {
      order_count: orders.length,
      data: orders,
    };
  }

  async findAllByProduct(productId: number) {
    const orders = await this.orderRepository.find({
      where: { product_id: productId },
      order: {
        createdAt: 'DESC', // createdAt을 기준으로 내림차순 정렬
      },
      select: [
        'id',
        'status',
        'product_name',
        'product_price',
        'product_thumbnail',
        'quantity',
        'createdAt',
      ],
    });

    return {
      order_count: orders.length,
      data: orders,
    };
  }

  async findOne(id: number, user: User) {
    //해당 user가 id에 해당하는 order의 소유인지 확인하기 위해 user_id도 같이 확인
    const order = await this.orderRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException(
        '해당 상품의 구매 내역을 확인할 수 없습니다.',
      );
    }

    return order;
  }

  async getOrderStatus(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      select: ['status'],
    });

    return order.status;
  }

  //배송중 배송 완료라는 상태를 업데이트함
  async updateAdmin(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    const statusValue = updateOrderStatusDto.status;
    const status = statusValue as OrderStatusType;

    //order update
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException(
        '해당 상품의 구매 내역을 확인할 수 없습니다.',
      );
    }

    if (
      order.status !== OrderStatus.PURCHASE_COMPLETED &&
      order.status !== OrderStatus.SHIPPING
    ) {
      throw new BadRequestException(
        '해당 주문은 배송 상태 변경이 불가능합니다.',
      );
    }

    order.status = status;
    //배송 완료 시에 deliveryat 만들어준다.
    if (status === OrderStatus.DELIVERY_COMPLETED) {
      order.deliveryAt = new Date();
    }
    const updateOrder = await this.orderRepository.save(order);

    return updateOrder;
  }

  //사용자가 배송지를 변경
  async updateAddress(
    id: number,
    updateOrderDeliveryDto: UpdateOrderDeliveryDto,
    user: User,
  ) {
    const {
      receiver,
      receiver_phone_number,
      delivery_address,
      delivery_address_detail,
      post_code,
      delivery_request,
    } = updateOrderDeliveryDto;

    const order = await this.orderRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException(
        '해당 상품의 구매 내역을 확인할 수 없습니다.',
      );
    }
    // 결제 완료, 반품 신청일 때 자신의 배송지를 바꿀 수 있다.
    if (
      order.status !== OrderStatus.PURCHASE_CONFIRM &&
      order.status !== OrderStatus.RETURN_REQUEST
    ) {
      throw new BadRequestException('해당 상품은 배송지 변경이 불가능합니다.');
    }

    order.receiver = receiver;
    order.receiver_phone_number = receiver_phone_number;
    order.delivery_address = delivery_address;
    order.delivery_address_detail = delivery_address_detail;
    order.post_code = post_code;
    order.delivery_request = delivery_request;

    const updateOrder = await this.orderRepository.save(order);

    return updateOrder;
  }

  //구매 확정
  async updateConfirm(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    user: User,
  ) {
    const statusValue = updateOrderStatusDto.status;
    const status = statusValue as OrderStatusType;

    //dto의 status가 명확한지 한 번 더 확인
    if (status !== OrderStatus.PURCHASE_CONFIRM) {
      throw new BadRequestException('잘못된 신청입니다.');
    }

    //order update
    const order = await this.orderRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException(
        '해당 상품의 구매 내역을 확인할 수 없습니다.',
      );
    }

    //배송 완료 시에만 구매확정이 가능
    if (order.status !== OrderStatus.DELIVERY_COMPLETED) {
      throw new BadRequestException('해당 상품은 구매확정이 불가능 합니다.');
    }

    order.status = status;
    const updateOrder = await this.orderRepository.save(order);

    return updateOrder;
  }

  async refundComplete(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    user: User,
  ) {
    //환불은 다른 api에서 진행하기 때문에 그 후에 환불 완료 상태로 order에 저장한다.
    const statusValue = updateOrderStatusDto.status;
    const status = statusValue as OrderStatusType;

    //결제 완료 때만 환불이 즉시 가능하다. 배송이 되었을 때는 반품으로 신청해야한다.
    const currentStatus = await this.getOrderStatus(id);
    if (currentStatus !== OrderStatus.PURCHASE_COMPLETED) {
      throw new BadRequestException('해당 상품은 환불신청이 불가능 합니다.');
    }

    //dto의 status가 명확한지 한 번 더 확인
    if (status !== OrderStatus.REFUND_COMPLETED) {
      throw new BadRequestException('잘못된 신청입니다.');
    }

    //order update
    const order = await this.orderRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException(
        '해당 상품의 구매 내역을 확인할 수 없습니다.',
      );
    }

    order.status = status;
    const refundOrder = await this.orderRepository.save(order);

    return refundOrder;
  }

  //반품 완료
  async returnComplete(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    //환불은 다른 api에서 진행하기 때문에 그 후에 반품 완료가 된다.
    const statusValue = updateOrderStatusDto.status;
    const status = statusValue as OrderStatusType;

    //order update
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException(
        '해당 상품의 구매 내역을 확인할 수 없습니다.',
      );
    }

    //반품 신청이 왔을 때만 해당 상품 반품 완료를 해줄 수 있다.
    const currentStatus = await this.getOrderStatus(id);
    if (currentStatus !== OrderStatus.RETURN_REQUEST) {
      throw new BadRequestException('해당 상품은 반품 완료가 불가능 합니다.');
    }

    //dto의 status가 명확한지 한 번 더 확인
    if (status !== OrderStatus.RETURN_COMPLETED) {
      throw new BadRequestException('잘못된 신청입니다.');
    }

    order.status = status;
    const returnOrder = await this.orderRepository.save(order);

    return returnOrder;
  }
}

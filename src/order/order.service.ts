import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { ProductService } from 'src/product/product.service';
import _ from 'lodash';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    //결제는 다른 api에서 진행. 정말 order 생성만 진행한다.

    //해당하는 product의 정보를 가져와 현재 값을 같이 저장한다.

    const {
      product_id,
      receiver,
      receiver_phone_number,
      delivery_name,
      delivery_address,
      delivery_request,
      quantity,
    } = createOrderDto;
    const product = await this.productService.getProductDetail(
      product_id,
      user.id,
    );

    //우리 쇼핑몰 구매는 기부 사이트의 point가 아닌 price로 진행함
    //product id는 현재 판매하는 상품으로 연결할 때 사용, name과 price는 변동 가능성 있으니 저장
    const createOrder = await this.orderRepository.save({
      product_id,
      status: '구매완료',
      receiver,
      receiver_phone_number,
      delivery_name,
      delivery_address,
      delivery_request,
      quantity,
      product_name: product.name,
      product_price: product.price,
      user_id: user.id,
    });

    return {
      success: true,
      message: '구매에 성공하였습니다.',
      data: createOrder,
    };
  }

  async findAll(user: User) {
    const orders = await this.orderRepository.find({
      where: { user_id: user.id },
      select: [
        'id',
        'status',
        'product_name',
        'product_price',
        'quantity',
        'createdAt',
      ],
    });

    return {
      success: true,
      message: '구매 내역을 정상적으로 불러왔습니다.',
      data: {
        order_count: orders.length,
        data: orders,
      },
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

    return {
      success: true,
      message: '구매 내역을 정상적으로 불러왔습니다.',
      data: order,
    };
  }

  async getOrderStatus(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      select: ['status'],
    });

    return order.status;
  }

  async adminUpdate(id: number, updateOrderDto: UpdateOrderDto) {
    const { status } = updateOrderDto;

    //order update
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException(
        '해당 상품의 구매 내역을 확인할 수 없습니다.',
      );
    }

    if (order.status === '환불신청' || order.status === '환불완료') {
      throw new BadRequestException('해당 주문은 환불을 신청하였습니다.');
    }

    order.status = status;
    const updateOrder = await this.orderRepository.save(order);

    return {
      success: true,
      message: '구매 내역이 변경되었습니다.',
      data: updateOrder,
    };
  }

  async confirmUpdate(id: number, updateOrderDto: UpdateOrderDto, user: User) {
    const { status } = updateOrderDto;

    //dto의 status가 명확한지 한 번 더 확인
    if (status !== '구매확정') {
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

    if (order.status === '환불신청' || order.status === '환불완료') {
      throw new BadRequestException('해당 상품은 구매확정이 불가능 합니다.');
    }

    order.status = status;
    const updateOrder = await this.orderRepository.save(order);

    return {
      success: true,
      message: '구매 확정이 완료되었습니다. 리뷰를 작성할 수 있습니다.',
      data: updateOrder,
    };
  }

  async refundRequest(id: number, updateOrderDto: UpdateOrderDto, user: User) {
    const { status } = updateOrderDto;

    //구매 확정, 환불 신청, 환불 완료인 상태는 환불 신청이 불가능함.
    //추가로 구매 완료된 시간을 확인해서 구매 시간이 일정 시간이 지나면 불가능 하도록.
    const currentStatus = await this.getOrderStatus(id);
    if (
      currentStatus === '구매확정' ||
      currentStatus === '환불신청' ||
      currentStatus === '환불완료'
    ) {
      throw new BadRequestException('해당 상품은 환불신청이 불가능 합니다.');
    }

    //dto의 status가 명확한지 한 번 더 확인
    if (status !== '환불신청') {
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
    const RefundOrder = await this.orderRepository.save(order);

    return {
      success: true,
      message: '환불신청이 완료되었습니다.',
      data: RefundOrder,
    };
  }

  async refundComplete(id: number, updateOrderDto: UpdateOrderDto, user: User) {
    const { status } = updateOrderDto;

    //환불 신청이 와있는 중인지 status 확인 환불 중 일때만 환불 진행 아니면 x
    const currentStatus = await this.getOrderStatus(id);
    if (currentStatus !== '환불신청') {
      throw new BadRequestException('해당 상품은 환불신청을 하지 않았습니다.');
    }

    //해당 user가 id에 해당하는 order의 소유인지 확인하기 위해 user_id도 같이 확인
    const order = await this.orderRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException(
        '해당 상품의 구매 내역을 확인할 수 없습니다.',
      );
    }

    //결제상으로 환불 불러오기
    order.status = status;
    const refundOrder = await this.orderRepository.save(order);

    return {
      success: true,
      message: '성공적으로 환불에 성공하였습니다.',
      data: refundOrder,
    };
  }
}

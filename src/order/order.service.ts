import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import _ from 'lodash';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User) {
    //구매 : 구매 내역이 status: 구매 완료가 뜨고 해당 가격만큼 user의 point를 깎는다.
    //아니면 front에서 create와 user의 update를 각각 불러와 처리하는 방법도 있다.

    const { product_id, quantity } = createOrderDto;
    
    const product = await this.productRepository.findOne({
      where: {id:product_id},
    });

    const userData = await this.userRepository.findOne({
      where: { id:user.id },
    });

    userData.point -= product.point * quantity;

    const userUpdate = await this.userRepository.save(userData);
    const createOrder = await this.orderRepository.save({
      product_id,
      user_id: user.id,
      quantity,
      status: "구매 완료"
    });

    return {
      success: true,
      message: "성공적으로 구매에 성공하였습니다.",
      data: {
        ...createOrder,
        remainPoint: userData.point
      }
    };
  }

  async findAll(user: User) {
    const orders = await this.orderRepository.find({
      where: { user_id: user.id }, 
    })

   const data = [];
    //mapping해서 product 내용도 일부 가져온다.
    for(const order of orders) {
      const product = await this.productRepository.findOne({
        where: {id: order.product_id}
      });

      const mappedItem = {
        id: order.id,
        product_id : order.product_id,
        user_id : order.user_id,
        productName: product.name,
        productStore: product.store_id,
        quantity: order.quantity,
        // 추가 필요한 매핑 작업 수행
      };

      data.push(mappedItem);

    }
    return {
      success: true,
      message: "구매 내역을 정상적으로 불러왔습니다.",
      data: {
        order_count: orders.length,
        data
      }
    };
  }

  async findOne(id: number, user: User) {
    //해당 user가 id에 해당하는 order의 소유인지 확인하기 위해 user_id도 같이 확인
    const order = await this.orderRepository.findOne({
      where: { id, user_id:user.id },
    })

    if (_.isNil(order)) {
      throw new NotFoundException('해당 상품의 구매 내역을 확인할 수 없습니다.');
    }

    const product = await this.productRepository.findOne({
      where: {id: order.product_id}
    });

    const mappedItem = {
      id: order.id,
      product_id : order.product_id,
      user_id : order.user_id,
      status: order.status,
      productName: product.name,
      productPoint: product.point,
      quantity: order.quantity,
      orderTime: order.createdAt
      // 추가 필요한 매핑 작업 수행
    };

    return {
      success: true,
      message: "구매 내역을 정상적으로 불러왔습니다.",
      data: mappedItem
    };
  }

  async getOrderStatus(id:number) {
    const order =  await this.orderRepository.findOne({
      where: { id },
      select: ['status']
    });

    return order.status;
  }

  //반복되는 것을 어떻게 줄여볼까? 
  async adminUpdate(id: number, updateOrderDto: UpdateOrderDto) {
    const { status } = updateOrderDto;

    //해당 작업이 필요함. 
    //배송이라던지 돈 입금을 확인하면 자동으로 올려준다던지. 하지만 지금 상황에선 없으므로 status만 변경해준다.

    //order update
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException('해당 상품의 구매 내역을 확인할 수 없습니다.');
    }

    order.status = status;
    const updateOrder = await this.orderRepository.save(order);

    return {
      success: true,
      message: "구매 내역이 변경되었습니다.",
      data: updateOrder
    };
  }

  async confirmUpdate(id: number, updateOrderDto: UpdateOrderDto, user: User) {
    const { status } = updateOrderDto;

     //dto의 status가 명확한지 한 번 더 확인
     if(status !== "구매확정"){
      throw new BadRequestException('잘못된 신청입니다.');
    }

    //order update
    const order = await this.orderRepository.findOne({
      where: { id, user_id:user.id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException('해당 상품의 구매 내역을 확인할 수 없습니다.');
    }

    order.status = status;
    const updateOrder = await this.orderRepository.save(order);

    return {
      success: true,
      message: "구매 확정이 완료되었습니다. 리뷰를 작성할 수 있습니다.",
      data: updateOrder
    };
  }

  async refundRequest(id: number, updateOrderDto: UpdateOrderDto, user: User) {
    const { status } = updateOrderDto;

    //구매 확정, 환불 신청, 환불 완료인 상태는 환불 신청이 불가능함.
    //추가로 구매 완료된 시간을 확인해서 구매 시간이 일정 시간이 지나면 불가능 하도록.
    const currentStatus = await this.getOrderStatus(id);
    if(currentStatus === "구매확정" || currentStatus === "환불신청" || currentStatus === "환불완료"){
      throw new BadRequestException('해당 상품은 환불신청이 불가능 합니다.');
    }

    //dto의 status가 명확한지 한 번 더 확인
    if(status !== "환불신청"){
      throw new BadRequestException('잘못된 신청입니다.');
    }

    //order update
    const order = await this.orderRepository.findOne({
      where: { id, user_id:user.id },
    });

    if (_.isNil(order)) {
      throw new NotFoundException('해당 상품의 구매 내역을 확인할 수 없습니다.');
    }

    order.status = status;
    const RefundOrder = await this.orderRepository.save(order);

    return {
      success: true,
      message: "환불신청이 완료되었습니다.",
      data: RefundOrder
    };
  }

  async refundComplete(id: number, updateOrderDto: UpdateOrderDto, user: User) {
    //환불 신청이 와있는 중인지 status 확인 환불 중 일때만 환불 진행 아니면 x
    const currentStatus = await this.getOrderStatus(id);
    if(currentStatus !== "환불신청"){
      throw new BadRequestException('해당 상품은 환불신청을 하지 않았습니다.');
    }

    //해당 user가 id에 해당하는 order의 소유인지 확인하기 위해 user_id도 같이 확인
    const order = await this.orderRepository.findOne({
      where: { id, user_id:user.id },
    })

    if (_.isNil(order)) {
      throw new NotFoundException('해당 상품의 구매 내역을 확인할 수 없습니다.');
    }

    //user의 point를 되돌려주고 status를 환불 완료로 update해준다.
    const product = await this.productRepository.findOne({
      where: {id:order.product_id},
    });

    const userData = await this.userRepository.findOne({
      where: { id:user.id },
    });

    userData.point += product.point * order.quantity;
    order.status = "환불완료" //or updateOrderDto.status를 받는다.
    
    const userUpdate = await this.userRepository.save(userData);
    const RefundOrder = await this.orderRepository.save(order);

    return {
      success: true,
      message: "성공적으로 환불에 성공하였습니다.",
      data: {
        ...RefundOrder,
        remainPoint: userData.point
      }
    };
  }

}

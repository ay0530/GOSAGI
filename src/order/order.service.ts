import { Injectable, NotFoundException } from '@nestjs/common';
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

  async update(id: number, updateOrderDto: UpdateOrderDto, user: User) {
    return `This action updates a #${id} order`;
  }

  async refundComplete(id: number, updateOrderDto: UpdateOrderDto, user: User) {
    //해당 user가 id에 해당하는 order의 소유인지 확인하기 위해 user_id도 같이 확인
    const order = await this.orderRepository.findOne({
      where: { id, user_id:user.id },
    })

    if (_.isNil(order)) {
      throw new NotFoundException('해당 상품의 구매 내역을 확인할 수 없습니다.');
    }

    //환불 신청이 와있는 중인지 status 확인 환불 중 일때만 환불 진행 아니면 x

    //user의 point를 되돌려주고 status를 환불 완료로 update해준다.
    //product point 때문에 매번 join해주는 거 귀찮... 구매금액을 저장하는 게 좋을까
    const product = await this.productRepository.findOne({
      where: {id:order.product_id},
    });

    const userData = await this.userRepository.findOne({
      where: { id:user.id },
    });

    userData.point += product.point * order.quantity;
    order.status = "환불완료"
    
    const userUpdate = await this.userRepository.save(userData);
    const RefundOrder = await this.orderRepository.save(order);

    return {
      success: true,
      message: "성공적으로 구매에 성공하였습니다.",
      data: {
        ...RefundOrder,
        remainPoint: userData.point
      }
    };
  }

  async remove(id: number, user: User) {
    return `This action removes a #${id} order`;
  }
}

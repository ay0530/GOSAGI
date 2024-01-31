import { IsNotEmpty } from 'class-validator';
import { OrderStatusType } from 'src/order/types/order-status.type';

export class CreateOrderDto {
  @IsNotEmpty({ message: '상품을 입력해 주세요.' })
  product_id: number;

  @IsNotEmpty({ message: '주문 상태를 입력해 주세요.' })
  status: OrderStatusType;

  @IsNotEmpty({ message: '수량을 입력해 주세요.' })
  quantity: number;

  @IsNotEmpty({ message: '수령인을 입력해 주세요.' })
  receiver: string;

  @IsNotEmpty({ message: '수령인의 휴대폰 번호를 입력해 주세요.' })
  receiver_phone_number: string;

  @IsNotEmpty({ message: '베송지 주소를 입력해 주세요.' })
  delivery_address: string;

  @IsNotEmpty({ message: '베송지 상세 주소를 입력해 주세요.' })
  delivery_address_detail: string;

  @IsNotEmpty({ message: '우편 번호를 입력해 주세요.' })
  post_code: string;

  delivery_request?: string;

  toss_order_id: string;

  //교환 시 입력 가능
  after_service_request: string;
}

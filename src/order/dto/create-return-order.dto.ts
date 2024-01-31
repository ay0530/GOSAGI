import { IsNotEmpty } from 'class-validator';
import { OrderStatusType } from 'src/order/types/order-status.type';

export class CreateReturnDto {
  @IsNotEmpty({ message: '주문 상태를 입력해 주세요.' })
  status: OrderStatusType;

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

  after_service_request: string;

  //기존의 것을 가져오면 될 것 같다.
  toss_order_id: string;
}

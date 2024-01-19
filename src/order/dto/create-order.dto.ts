import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: '상품을 입력해 주세요.' })
  product_id: number;

  @IsNotEmpty({ message: '수량을 입력해 주세요.' })
  quantity: number;

  @IsNotEmpty({ message: '수령인을 입력해 주세요.' })
  receiver: string;

  @IsNotEmpty({ message: '수령인의 휴대폰 번호를 입력해 주세요.' })
  receiver_phone_number: string;

  @IsNotEmpty({ message: '배송지 이름을 입력해 주세요.' })
  delivery_name: string;

  @IsNotEmpty({ message: '베송지 주소를 입력해 주세요.' })
  delivery_address: string;

  delivery_request?: string;
}

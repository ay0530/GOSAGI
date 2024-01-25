import { IsNotEmpty } from 'class-validator';

export class UpdateOrderDeliveryDto {
  @IsNotEmpty({ message: '수령인을 입력해 주세요.' })
  receiver: string;

  @IsNotEmpty({ message: '수령인의 휴대폰 번호를 입력해 주세요.' })
  receiver_phone_number: string;

  @IsNotEmpty({ message: '배송지 이름을 입력해 주세요.' })
  delivery_name: string;

  @IsNotEmpty({ message: '베송지 주소를 입력해 주세요.' })
  delivery_address: string;

  @IsNotEmpty({ message: '우편 번호를 입력해 주세요.' })
  post_code: string;

  delivery_request?: string;
}

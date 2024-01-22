import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: '상품을 입력해 주세요.' })
  product_id: number;

  @IsNotEmpty({ message: '수량을 입력해 주세요.' })
  quantity: number;

  //저장된 배송지를 불러와 사용할 경우
  //fetch에서 연결할 때 해당하는 배송지 id 클릭할 때 배송지 정보 자동으로 불러와 body에 넣어주도록 제작
  //아닌 경우는 입력하도록 하여 값 바로 받는다
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

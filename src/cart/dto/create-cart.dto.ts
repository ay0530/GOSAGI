import { IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty({ message: '상품을 입력해 주세요' })
  product_id: number;

  @IsNotEmpty({ message: '수량을 입력해 주세요.' })
  quantity: number;
}

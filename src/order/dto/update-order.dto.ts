import { IsNotEmpty } from 'class-validator';

export class UpdateOrderDto {
  @IsNotEmpty({ message: '상품을 입력해 주세요' })
  status: string;
}

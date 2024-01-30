import { IsNotEmpty } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto extends PickType(CreateCartDto, ['quantity']) {
  @IsNotEmpty({ message: '수량을 입력해 주세요.' })
  quantity: number;
}

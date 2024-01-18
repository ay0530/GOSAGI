import { IsNotEmpty } from 'class-validator';


export class CreateWishDto {
    @IsNotEmpty({ message: '상품을 입력해 주세요'})
    product_id: number;
}

import { IsNotEmpty } from 'class-validator';


export class CreateWishDto {
    @IsNotEmpty({ message: '상품을 입력하세요'})
    product_id: number;
}

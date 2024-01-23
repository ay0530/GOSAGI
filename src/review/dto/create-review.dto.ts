import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
    @IsNotEmpty({ message: '리뷰를 남길 구매 내역을 입력해 주세요.'})
    order_id: number;
    
    @IsNotEmpty({ message: '평점을 입력해 주세요.'})
    rate: number;

    @IsNotEmpty({ message: '리뷰 내용을 입력해 주세요.'})
    content: string;
}

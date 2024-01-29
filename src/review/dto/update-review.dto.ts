import { PickType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateReviewDto extends PickType(CreateReviewDto, [
  'rate',
  'content',
]) {
  @IsNotEmpty({ message: '평점을 입력해 주세요.' })
  rate: number;

  @IsNotEmpty({ message: '리뷰 내용을 입력해 주세요.' })
  content: string;
}

import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  // 0이면 서비스에 대한 문의 1 이상이면 상품에 대한 문의
  @IsInt({ message: '숫자를 입력해주세요.' })
  @IsNotEmpty({ message: '문의 카테고리를 입력해주세요.' })
  productId: number;

  @IsNotEmpty({ message: '제목을 입력해 주세요' })
  title: string;

  @IsNotEmpty({ message: '내용을 입력해 주세요' })
  content: string;

  isPrivate: boolean;

  password: string;
}

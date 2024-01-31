import { IsNotEmpty } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty({ message: '내용을 입력해 주세요' })
  content: string;
}

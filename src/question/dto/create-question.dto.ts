import { IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty({ message: '제목을 입력해 주세요' })
  title: string;

  @IsNotEmpty({ message: '비밀번호를 입력해 주세요' })
  content: string;
}

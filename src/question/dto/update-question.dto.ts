import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  @IsInt({ message: '숫자를 입력해주세요.' })
  @IsNotEmpty({ message: '문의 글 삭제 여부를 입력해주세요' })
  status: number;
}

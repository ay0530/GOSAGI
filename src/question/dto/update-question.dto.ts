import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  @IsBoolean({ message: 'boolean 타입을 입력해주세요.' })
  @IsNotEmpty({ message: '문의 글 삭제 여부를 입력해주세요' })
  isDeleted: boolean;
}

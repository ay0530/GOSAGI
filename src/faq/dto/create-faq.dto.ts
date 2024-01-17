import { PickType } from '@nestjs/mapped-types';
import { Faq } from '../entities/faq.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFaqDto extends PickType(Faq, ['title', 'content']) {
  @IsNotEmpty({ message: '제목을 입력해 주세요.' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: '내용을 입력해 주세요.' })
  @IsString()
  content: string;
}

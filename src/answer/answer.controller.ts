import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt.guard';

import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ResponseDto } from 'src/ResponseDTO/response-dto';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // 답변 저장
  @UseGuards(JwtAuthGuard)
  @Post(':questionId')
  async create(
    @Param('questionId') questionId: number,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    const data = await this.answerService.create(createAnswerDto, questionId);

    const response = new ResponseDto(true, '등록이 완료되었습니다', data);
    return response;
  }

  // 답변 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.answerService.remove(+id);

    const response = new ResponseDto(true, '삭제가 완료되었습니다', null);
    return response;
  }

  // 답변 조회는 question에서 join으로 처리할 것 - 이아영
}

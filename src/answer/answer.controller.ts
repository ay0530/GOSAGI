import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt.guard';

import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ResponseDto } from 'src/ResponseDTO/response-dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/user/types/userRole.type';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // 답변 저장
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Post(':questionId')
  async create(
    @Param('questionId') questionId: number,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    const data = await this.answerService.create(createAnswerDto, questionId);

    const response = new ResponseDto(true, '등록이 완료되었습니다', data);
    return response;
  }

  @Get(':questionId')
  async findOne(@Param('questionId') questionId: number) {
    const data = await this.answerService.findOne(questionId);

    const response = new ResponseDto(true, '조회가 완료되었습니다', data);
    return response;
  }

  // 답변 삭제
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.answerService.remove(id);

    const response = new ResponseDto(true, '삭제가 완료되었습니다', null);
    return response;
  }

  // 답변 조회는 question에서 join으로 처리할 것 - 이아영
}

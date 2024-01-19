import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAnswerDto } from './dto/create-answer.dto';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}

  // 문의 답변 저장
  async create(createAnswerDto: CreateAnswerDto, questionId: number) {
    // 문의 답변 저장
    const answer = await this.answerRepository.save({
      question_id: questionId,
      content: createAnswerDto.content,
    });

    return answer;
  }

  // 문의 답변 상세 조회
  async findOne(questionId: number) {
    // 문의 글 상세 조회
    const answer = await this.answerRepository.findOne({
      where: { question_id: questionId },
    });

    return answer;
  }

  // 문의 답변 삭제
  async remove(id: number) {
    await this.answerRepository.delete(id);
  }
}

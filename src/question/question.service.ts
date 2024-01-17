import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  // 문의 글 저장
  async create(createQuestionDto: CreateQuestionDto, userId: number) {
    // 문의 글 저장
    const question = await this.questionRepository.save({
      user_id: userId,
      title: createQuestionDto.title,
      content: createQuestionDto.content,
    });

    return question;
  }

  // 문의 글 상세 조회
  async findOne(id: number, userId: number) {
    // 문의 글 상세 조회
    const question = await this.questionRepository.findOne({
      where: { id },
    });

    return question;
  }

  // 문의 글 수정
  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
    userId: number,
  ) {
    // 문의 글 수정
    const question = await this.questionRepository.update(
      { id, user_id: userId },
      {
        title: updateQuestionDto.title,
        content: updateQuestionDto.content,
      },
    );

    // 업데이트 실패
    if (!question.affected && question.affected === 0) {
      throw new ForbiddenException('권한이 존재하지 않습니다');
    }

    return {
      title: updateQuestionDto.title,
      content: updateQuestionDto.content,
    };
  }

  // 문의 글 삭제
  async remove(id: number, userId: number) {
    // 문의 글 삭제
    const question = await this.questionRepository.delete({
      id,
      user_id: userId,
    });

    // 삭제 실패
    if (!question.affected && question.affected === 0) {
      // 가드로 나중에 빼야할듯
      throw new ForbiddenException('권한이 존재하지 않습니다');
    }
  }

  // 문의 목록 조회
  async findAll() {
    const questions = await this.questionRepository.find({
      order: { created_at: 'DESC' },
    });

    return questions;
  }

  // 문의 목록 검색
  async searchAll(category: string, keyword: string) {
    // 제목, 내용으로 검색 가능
    const questions = this.questionRepository
      .createQueryBuilder('question')
      .where(`question.${category} LIKE :keyword`, {
        keyword: `%${keyword}%`,
      })
      .orderBy('question.created_at', 'DESC')
      .getMany();

    return questions;
  }

  // 내 문의 목록 조회
  async findMyAll(userId: number) {
    const questions = await this.questionRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    return questions;
  }

  // 내 문의 목록 검색
  async searchMyAll(category: string, keyword: string, userId: number) {
    // 제목, 내용으로 검색 가능
    const questions = this.questionRepository
      .createQueryBuilder('question')
      .where(`question.${category} LIKE :keyword`, {
        keyword: `%${keyword}%`,
      })
      .andWhere(`question.user_id = :userId`, {
        userId,
      })
      .orderBy('question.created_at', 'DESC')
      .getMany();

    return questions;
  }
}

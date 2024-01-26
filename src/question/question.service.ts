import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder, getRepository } from 'typeorm';

import { AnswerService } from 'src/answer/answer.service';
import { ProductService } from 'src/product/product.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private answerService: AnswerService,
    private productService: ProductService,
  ) {}

  // 문의 글 저장
  async create(createQuestionDto: CreateQuestionDto, userId: number) {
    // 문의 글 저장
    const question = await this.questionRepository.save({
      user_id: userId,
      product_id: createQuestionDto.productId,
      title: createQuestionDto.title,
      content: createQuestionDto.content,
      is_private: createQuestionDto.isPrivate,
    });

    return question;
  }

  // 문의 글 상세 조회 (user)
  async findOneForUser(id: number, userId: number) {
    // 문의 글 상세 조회
    const question = await this.questionRepository.findOne({
      where: { id },
    });

    //비밀글일 때 자신만 확인이 가능함.
    if (question.is_private && question.user_id !== userId) {
      throw new ForbiddenException('해당 문의글을 확인할 수 없습니다.');
    }

    // 문의 답변 조회
    const answer = await this.answerService.findOne(id);

    // 답변이 있을 경우 답변도 함께 조회
    if (answer) {
      return { question, answer, status: '답변완료' };
    } else {
      return { question, status: '답변대기' };
    }
  }

  // 문의 글 상세 조회 (admin, seller)
  async findOne(id: number) {
    // 문의 글 상세 조회
    const question = await this.questionRepository.findOne({
      where: { id },
    });

    // 문의 답변 조회
    const answer = await this.answerService.findOne(id);

    // 답변이 있을 경우 답변도 함께 조회
    if (answer) {
      return { question, answer, status: '답변완료' };
    } else {
      return { question, status: '답변대기' };
    }
  }

  // 문의 글 수정
  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
    userId: number,
  ) {
    // 문의 답변 조회
    const answer = await this.answerService.findOne(id);

    // 답변이 있을 경우 수정 불가능
    // 프론트에서 버튼 숨기면 되긴 하는데 혹시 몰라 예외 처리
    if (answer) {
      throw new BadRequestException('답변이 완료된 글입니다.');
    }

    // 문의 글 수정
    const question = await this.questionRepository.update(
      { id, user_id: userId },
      {
        is_deleted: updateQuestionDto.isDeleted,
        title: updateQuestionDto.title,
        content: updateQuestionDto.content,
      },
    );

    // 업데이트 실패
    // 가드로 나중에 빼야할듯
    if (!question.affected && question.affected === 0) {
      throw new ForbiddenException('권한이 존재하지 않습니다');
    }

    return {
      title: updateQuestionDto.title,
      content: updateQuestionDto.content,
    };
  }

  // 문의 글 삭제
  // 문의 글을 삭제시키는 대신 보존하고 status 값을 바꿔주기로 함
  // async remove(id: number, userId: number) {
  //   // 문의 글 삭제
  //   const question = await this.questionRepository.delete({
  //     id,
  //     user_id: userId,
  //   });

  //   // 삭제 실패
  //   if (!question.affected && question.affected === 0) {
  //     // 가드로 나중에 빼야할듯
  //     throw new ForbiddenException('권한이 존재하지 않습니다');
  //   }
  // }

  // 문의 목록 조회(회원)
  async findAll() {
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.answer', 'answer') // LEFT JOIN
      .where('question.is_deleted = 0')
      .orderBy('question.created_at', 'DESC')
      .getMany();

    // 답변 여부에 따라 맵핑
    const result = questions.map((question) => {
      if (question.answer) {
        return { question, status: '답변완료' };
      } else {
        return { question, status: '답변대기' };
      }
    });

    return result;

    // const questions = await this.questionRepository.find({
    //   where: { is_deleted: false },
    //   order: { created_at: 'DESC' },
    // });

    // return questions;
  }

  // 문의 목록 검색
  async searchAll(category: string, keyword: string) {
    // 제목, 내용으로 검색 가능
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.answer', 'answer') // LEFT JOIN
      .where(`question.${category} LIKE :keyword`, {
        keyword: `%${keyword}%`,
      })
      .andWhere(`question.is_deleted = 0`)
      .orderBy('question.created_at', 'DESC')
      .getMany();

    const result = questions.map((question) => {
      if (question.answer) {
        return { question, status: '답변완료' };
      } else {
        return { question, status: '답변대기' };
      }
    });

    return result;
  }

  // 내 문의 목록 조회
  async findMyAll(userId: number) {
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.answer', 'answer') // LEFT JOIN
      .where('question.is_deleted = 0 AND question.user_id = :userId', {
        userId: userId,
      })
      .orderBy('question.created_at', 'DESC')
      .getMany();

    // 답변 여부에 따라 맵핑
    const result = questions.map((question) => {
      if (question.answer) {
        return { question, status: '답변완료' };
      } else {
        return { question, status: '답변대기' };
      }
    });

    return result;
  }

  // 내 문의 목록 검색
  async searchMyAll(category: string, keyword: string, userId: number) {
    // 제목, 내용으로 검색 가능
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.answer', 'answer') // LEFT JOIN
      .where(`question.${category} LIKE :keyword`, {
        keyword: `%${keyword}%`,
      })
      .andWhere(`question.user_id = :userId`, {
        userId,
      })
      .andWhere(`question.is_deleted = false`)
      .orderBy('question.created_at', 'DESC')
      .getMany();

    // 답변 여부에 따라 맵핑
    const result = questions.map((question) => {
      if (question.answer) {
        return { question, status: '답변완료' };
      } else {
        return { question, status: '답변대기' };
      }
    });

    return result;
  }

  // 내 매장의 문의 목록 조회
  async findStoreAll(storeId: number) {
    // 상품 번호 목록 조회
    const productIds = await this.productService.findProductIds(storeId);

    // 상품 번호들로 검색해
    const questions = await this.questionRepository.find({
      where: { product_id: In(productIds), is_deleted: false },
      order: { created_at: 'DESC' },
      relations: ['answer'],
    });

    const result = questions.map((question) => {
      if (question.answer) {
        return { question, status: '답변완료' };
      } else {
        return { question, status: '답변대기' };
      }
    });

    return result;
  }

  // 내 매장의 문의 목록 검색
  async searchStoreAll(category: string, keyword: string, storeId: number) {
    // 상품 번호 목록 조회
    const productIds = await this.productService.findProductIds(storeId);

    // 제목, 내용으로 검색 가능
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.answer', 'answer') // LEFT JOIN
      .where(`question.${category} LIKE :keyword`, { keyword: `%${keyword}%` })
      .andWhere(`question.product_id IN (:...productIds)`, { productIds })
      .andWhere(`question.is_deleted = false`)
      .orderBy('question.created_at', 'DESC')
      .getMany();

    // 답변 여부에 따라 맵핑
    const result = questions.map((question) => {
      if (question.answer) {
        return { question, status: '답변완료' };
      } else {
        return { question, status: '답변대기' };
      }
    });

    return result;
  }

  // 내 매장의 특정 상품 문의 목록 조회
  async findProductAll(productId: number) {
    const questions = await this.questionRepository.find({
      where: { product_id: productId, is_deleted: false },
      order: { created_at: 'DESC' },
      relations: ['answer'],
    });

    const result = questions.map((question) => {
      if (question.answer) {
        return { question, status: '답변완료' };
      } else {
        return { question, status: '답변대기' };
      }
    });

    return result;
  }

  // 내 매장의 특정 상품 문의 목록 검색
  async searchProductAll(category: string, keyword: string, productId: number) {
    // 제목, 내용으로 검색 가능
    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.answer', 'answer') // LEFT JOIN
      .where(`question.${category} LIKE :keyword`, {
        keyword: `%${keyword}%`,
      })
      .andWhere(`question.product_id = :productId`, {
        productId,
      })
      .andWhere(`question.is_deleted = false`)
      .orderBy('question.created_at', 'DESC')
      .getMany();

    const result = questions.map((question) => {
      if (question.answer) {
        return { question, status: '답변완료' };
      } else {
        return { question, status: '답변대기' };
      }
    });

    return result;
  }
}

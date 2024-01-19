import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {}

  // FAQ 생성
  async createFaq(createFaqDto: CreateFaqDto) {
    const { title, content } = createFaqDto;
    if (!title) {
      throw new BadRequestException('제목을 입력해 주세요.');
    }
    if (!content) {
      throw new BadRequestException('내용을 입력해 주세요.');
    }
    const newFaq = await this.faqRepository.save({ title, content });
    return newFaq;
  }

  // FAQ 조회
  async getFaq() {
    const getAllFaq = await this.faqRepository.find({
      order: { created_at: 'DESC' },
    });
    return getAllFaq;
  }

  // 특정 FAQ 조회
  async getOneFaq(faqId: number) {
    const getOneFaq = await this.faqRepository.findOne({
      where: { id: faqId },
    });
    return getOneFaq;
  }

  // FAQ 검색
  async searchFaq(keyword: string) {
    const keywordFaq = this.faqRepository
      .createQueryBuilder('faq')
      .where('title', {
        keyword: `%${keyword}%`,
      })
      .getMany();

    return keywordFaq;
  }

  // FAQ 수정
  async updateFaq(faqId: number, updateFaqDto: UpdateFaqDto) {
    const existFaq = await this.faqRepository.findOne({
      where: { id: faqId },
    });
    if (!existFaq) {
      throw new NotFoundException('FAQ가 존재하지 않습니다.');
    }
    await this.faqRepository.update({ id: faqId }, updateFaqDto);
    return updateFaqDto;
  }

  // FAQ 삭제
  async deleteFaq(faqId: number) {
    const existFaq = await this.faqRepository.findOne({
      where: { id: faqId },
    });
    if (!existFaq) {
      throw new NotFoundException('FAQ가 존재하지 않습니다.');
    }
    await this.faqRepository.delete({ id: faqId });
  }
}

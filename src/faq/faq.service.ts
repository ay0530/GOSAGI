import { Injectable } from '@nestjs/common';
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
  createFaq(createFaqDto: CreateFaqDto) {
    return 'This action adds a new faq';
  }

  getFaq() {
    return `This action returns all faq`;
  }

  getOneFaq(id: number) {
    return `This action returns a #${id} faq`;
  }

  updateFaq(id: number, updateFaqDto: UpdateFaqDto) {
    return `This action updates a #${id} faq`;
  }

  deleteFaq(id: number) {
    return `This action removes a #${id} faq`;
  }
}

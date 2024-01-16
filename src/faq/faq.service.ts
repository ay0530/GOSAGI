import { Injectable } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
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

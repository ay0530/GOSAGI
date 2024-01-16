import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // FAQ 생성
  @Post()
  async createFaq(@Body() createFaqDto: CreateFaqDto) {
    const faq = await this.faqService.createFaq(createFaqDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'FAQ 생성 완료.',
      faq,
    };
  }

  // FAQ 조회
  @Get()
  async getFaq() {
    const allFaq = await this.faqService.getFaq();
    return {
      statusCode: HttpStatus.OK,
      message: 'FAQ 조회 완료.',
      allFaq,
    };
  }

  // 특정 FAQ 조회
  @Get(':faqId')
  async getOneFaq(@Param('faqId') faqId: string) {
    const oneFaq = await this.faqService.getOneFaq(+faqId);
    return {
      statusCode: HttpStatus.OK,
      message: '특정 FAQ 조회 완료.',
      oneFaq,
    };
  }

  // FAQ 수정
  @Patch(':faqId')
  async updateFaq(
    @Param('faqId') faqId: string,
    @Body() updateFaqDto: UpdateFaqDto,
  ) {
    const updateFaq = await this.faqService.updateFaq(+faqId, updateFaqDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'FAQ 수정 완료.',
      updateFaq,
    };
  }

  // FAQ 삭제
  @Delete(':faqId')
  async deleteFaq(@Param('faqId') faqId: string) {
    await this.faqService.deleteFaq(+faqId);
    return {
      statusCode: HttpStatus.OK,
      message: 'FAQ 삭제 완료.',
    };
  }
}

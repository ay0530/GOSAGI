import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // FAQ 생성
  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  // FAQ 조회
  @Get()
  findAll() {
    return this.faqService.findAll();
  }

  // 특정 FAQ 조회
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(+id);
  }

  // FAQ 수정
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(+id, updateFaqDto);
  }

  // FAQ 삭제
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(+id);
  }
}

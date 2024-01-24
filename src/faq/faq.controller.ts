import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/user/types/userRole.type';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // FAQ 생성
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async createFaq(@Body() createFaqDto: CreateFaqDto) {
    const data = await this.faqService.createFaq(createFaqDto);
    return {
      success: true,
      message: 'FAQ 생성이 완료되었습니다.',
      data,
    };
  }

  // FAQ 조회
  @Get()
  async getFaq() {
    const data = await this.faqService.getFaq();
    return {
      success: true,
      message: 'FAQ 조회가 완료되었습니다.',
      data,
    };
  }

  // 특정 FAQ 조회
  @Get('/detail/:faqId')
  async getOneFaq(@Param('faqId') faqId: string) {
    const data = await this.faqService.getOneFaq(+faqId);
    return {
      success: true,
      message: '특정 FAQ 조회가 완료되었습니다.',
      data,
    };
  }

  // FAQ 검색
  @Get('keyword')
  async searchFaq(@Query('keyword') keyword: string) {
    const data = await this.faqService.searchFaq(keyword);
    return {
      success: true,
      message: 'FAQ 검색이 완료되었습니다.',
      data,
    };
  }

  // FAQ 수정
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':faqId')
  async updateFaq(
    @Param('faqId') faqId: string,
    @Body() updateFaqDto: UpdateFaqDto,
  ) {
    const data = await this.faqService.updateFaq(+faqId, updateFaqDto);
    return {
      success: true,
      message: 'FAQ 수정이 완료되었습니다.',
      data,
    };
  }

  // FAQ 삭제
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':faqId')
  async deleteFaq(@Param('faqId') faqId: string) {
    await this.faqService.deleteFaq(+faqId);
    return {
      success: true,
      message: 'FAQ 삭제가 완료되었습니다.',
    };
  }
}

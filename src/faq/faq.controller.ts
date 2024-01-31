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
import { ResponseDto } from 'src/ResponseDTO/response-dto';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // FAQ 생성
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async createFaq(@Body() createFaqDto: CreateFaqDto) {
    const data = await this.faqService.createFaq(createFaqDto);
    const response = new ResponseDto(true, 'FAQ 생성이 완료되었습니다.', data);
    return response;
  }

  // FAQ 조회
  @Get()
  async getFaq() {
    const data = await this.faqService.getFaq();
    const response = new ResponseDto(true, 'FAQ 조회가 완료되었습니다.', data);
    return response;
  }

  // 특정 FAQ 조회
  @Get('/detail/:faqId')
  async getOneFaq(@Param('faqId') faqId: number) {
    const data = await this.faqService.getOneFaq(faqId);
    const response = new ResponseDto(
      true,
      '특정 FAQ 조회가 완료되었습니다.',
      data,
    );
    return response;
  }

  // FAQ 검색
  @Get('keyword')
  async searchFaq(@Query('keyword') keyword: string) {
    const data = await this.faqService.searchFaq(keyword);
    const response = new ResponseDto(true, 'FAQ 검색이 완료되었습니다.', data);
    return response;
  }

  // FAQ 수정
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':faqId')
  async updateFaq(
    @Param('faqId') faqId: number,
    @Body() updateFaqDto: UpdateFaqDto,
  ) {
    const data = await this.faqService.updateFaq(faqId, updateFaqDto);
    const response = new ResponseDto(true, 'FAQ 수정이 완료되었습니다.', data);
    return response;
  }

  // FAQ 삭제
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':faqId')
  async deleteFaq(@Param('faqId') faqId: number) {
    await this.faqService.deleteFaq(faqId);
    const response = new ResponseDto(true, 'FAQ 삭제가 완료되었습니다.', null);
    return response;
  }
}

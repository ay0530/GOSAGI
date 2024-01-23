import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt.guard';

import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ResponseDto } from 'src/ResponseDTO/response-dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // 문의 글 저장
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto, @Req() req: any) {
    const data = await this.questionService.create(
      createQuestionDto,
      req.user.id,
    );

    const response = new ResponseDto(true, '등록이 완료되었습니다', data);
    return response;
  }

  // 문의 글 상세 조회
  @UseGuards(JwtAuthGuard)
  @Get('detail/:id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const data = await this.questionService.findOne(+id, req.user.id);

    const response = new ResponseDto(
      true,
      '문의 내용 조회가 완료되었습니다',
      data,
    );
    return response;
  }

  // 문의 글 수정
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Req() req: any,
  ) {
    const data = await this.questionService.update(
      +id,
      updateQuestionDto,
      req.user.id,
    );

    const message =
      updateQuestionDto.isDeleted === true
        ? '수정이 완료되었습니다'
        : '삭제가 완료되었습니다';
    const responseData = updateQuestionDto.isDeleted === true ? data : null;
    const response = new ResponseDto(true, message, responseData);
    return response;
  }

  // 문의 글 삭제
  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // async remove(@Param('id') id: string, @Req() req: any) {
  //   const data = await this.questionService.remove(+id, req.user.id);

  //   const response = new ResponseDto(true, '삭제가 완료되었습니다', null);
  //   return response;
  // }

  // 문의 목록 조회
  @Get('list')
  async findAll() {
    const data = await this.questionService.findAll();

    const response = new ResponseDto(
      true,
      '문의 목록 조회가 완료되었습니다',
      data,
    );
    return response;
  }

  // 문의 목록 검색
  @Get('list/:category/:keyword')
  async searchAll(
    @Param('category') category: string,
    @Param('keyword') keyword: string,
  ) {
    const data = await this.questionService.searchAll(category, keyword);

    const response = new ResponseDto(true, '검색이 완료되었습니다', data);
    return response;
  }

  // 내가 작성한 문의 목록 조회
  @UseGuards(JwtAuthGuard)
  @Get('myList')
  async findMyAll(@Req() req: any) {
    const data = await this.questionService.findMyAll(req.user.id);

    const response = new ResponseDto(
      true,
      '문의 목록 조회가 완료되었습니다',
      data,
    );
    return response;
  }

  // 내가 작성한 문의 목록 검색
  @UseGuards(JwtAuthGuard)
  @Get('myList/:category/:keyword')
  async searchMyAll(
    @Param('category') category: string,
    @Param('keyword') keyword: string,
    @Req() req: any,
  ) {
    const data = await this.questionService.searchMyAll(
      category,
      keyword,
      req.user.id,
    );

    const response = new ResponseDto(true, '검색이 완료되었습니다', data);
    return response;
  }

  // 내 매장의 문의 목록 조회
  @UseGuards(JwtAuthGuard)
  @Get('storeList/:storeId')
  async findStoreAll(@Param('storeId') storeId: number) {
    const data = await this.questionService.findStoreAll(storeId);

    const response = new ResponseDto(
      true,
      '문의 목록 조회가 완료되었습니다',
      data,
    );
    return response;
  }

  // 내 매장의 문의 목록 검색
  @UseGuards(JwtAuthGuard)
  @Get('storeList/:storeId/:category/:keyword')
  async searchStoreAll(
    @Param('category') category: string,
    @Param('keyword') keyword: string,
    @Param('storeId') storeId: number,
  ) {
    const data = await this.questionService.searchStoreAll(
      category,
      keyword,
      storeId,
    );

    const response = new ResponseDto(true, '검색이 완료되었습니다', data);
    return response;
  }

  // 내 매장의 특정 상품 문의 목록 조회
  @UseGuards(JwtAuthGuard)
  @Get('productList/:productId')
  async findProductAll(@Param('productId') productId: number) {
    const data = await this.questionService.findProductAll(productId);

    const response = new ResponseDto(
      true,
      '문의 목록 조회가 완료되었습니다',
      data,
    );
    return response;
  }

  // 내 매장의 특정 상품 문의 목록 검색
  @UseGuards(JwtAuthGuard)
  @Get('productList/:productId/:category/:keyword')
  async searchProductAll(
    @Param('category') category: string,
    @Param('keyword') keyword: string,
    @Param('productId') productId: number,
  ) {
    const data = await this.questionService.searchProductAll(
      category,
      keyword,
      productId,
    );

    const response = new ResponseDto(true, '검색이 완료되었습니다', data);
    return response;
  }
}

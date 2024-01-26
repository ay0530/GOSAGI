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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ResponseDto } from 'src/ResponseDTO/response-dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @Req() req) {
    const data = await this.reviewService.create(createReviewDto, req.user);
    const response = new ResponseDto(true, '리뷰 작성에 성공하였습니다.', data);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req) {
    const data = await this.reviewService.findAll(req.user);
    const response = new ResponseDto(
      true,
      '리뷰를 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req) {
    const data = await this.reviewService.findOne(id, req.user);
    const response = new ResponseDto(
      true,
      '리뷰 내용을 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  @Get('/product/:productId')
  async findByProduct(@Param('productId') productId: number) {
    const data = await this.reviewService.findAllByProductId(productId);
    const response = new ResponseDto(
      true,
      '리뷰를 정상적으로 불러왔습니다.',
      data,
    );
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req,
  ) {
    const data = await this.reviewService.update(id, updateReviewDto, req.user);
    const response = new ResponseDto(
      true,
      '리뷰가 정상적으로 수정되었습니다.',
      data,
    );
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    const data = await this.reviewService.remove(id, req.user);
    const response = new ResponseDto(
      true,
      '리뷰가 정상적으로 삭제되었습니다.',
      data,
    );
    return response;
  }
}

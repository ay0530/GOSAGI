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


@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Req() req) {
    const user = req.user;
    return this.reviewService.create(createReviewDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    const user = req.user;
    return this.reviewService.findAll(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number, @Req() req) {
    const user = req.user;
    return this.reviewService.findOne(id, user);
  }

  @Get('/product/:productId')
  findByProduct(@Param('productId') productId: number) {
    return this.reviewService.findAllByProductId(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateReviewDto: UpdateReviewDto, @Req() req) {
    const user = req.user;
    return this.reviewService.update(id, updateReviewDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    const user = req.user;
    return this.reviewService.remove(id, user);
  }
}

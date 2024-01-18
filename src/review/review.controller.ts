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

@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Req() req) {
    const user = req.user;
    return this.reviewService.create(createReviewDto, user);
  }

  @Get()
  findAll(@Req() req) {
    const user = req.user;
    return this.reviewService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Req() req) {
    const user = req.user;
    return this.reviewService.findOne(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateReviewDto: UpdateReviewDto, @Req() req) {
    const user = req.user;
    return this.reviewService.update(+id, updateReviewDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    const user = req.user;
    return this.reviewService.remove(id, user);
  }
}

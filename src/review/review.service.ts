import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import _ from 'lodash';
import { OrderService } from 'src/order/order.service';
import { OrderStatus } from 'src/order/types/order-status.type';
@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly orderService: OrderService,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User) {
    const { order_id, rate, content } = createReviewDto;

    //해당 user가 작성한 order_id가 존재하는지 먼저 확인
    await this.orderService.findOne(order_id, user);

    //order의 status가 구매확정인 경우에만 리뷰 작성 가능
    const status = await this.orderService.getOrderStatus(order_id);

    if (status !== OrderStatus.PURCHASE_CONFIRM) {
      throw new BadRequestException(
        '구매확정이 된 상품만 리뷰를 작성할 수 있습니다.',
      );
    }

    //review 작성
    const createReview = await this.reviewRepository.save({
      content,
      rate,
      order_id,
      user_id: user.id,
    });

    return createReview;
  }

  async findAll(user: User) {
    const reviews = await this.reviewRepository.find({
      where: { user_id: user.id },
    });

    const totalRate = reviews.reduce((sum, review) => sum + review.rate, 0);

    return {
      review_count: reviews.length,
      review_average_rate: totalRate / reviews.length,
      reviews,
    };
  }

  async findOne(id: number, user: User) {
    //해당 user가 id에 해당하는 review의 소유인지 확인하기 위해 user_id도 같이 확인
    const review = await this.reviewRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(review)) {
      throw new NotFoundException('해당 리뷰를 확인할 수 없습니다.');
    }

    return review;
  }

  async findAllByProductId(productId: number) {
    const reviews = await this.reviewRepository.find({
      where: { order: { product_id: productId } },
      relations: ['user'],
    });

    const totalRate = reviews.reduce((sum, review) => sum + review.rate, 0);

    return {
      review_length: reviews.length,
      review_average_rate: Math.round((totalRate / reviews.length) * 10) / 10,
      data: reviews,
    };
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, user: User) {
    const { content, rate } = updateReviewDto;

    //해당 user가 id에 해당하는 review의 소유인지 확인하기 위해 user_id도 같이 확인
    const review = await this.reviewRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(review)) {
      throw new NotFoundException('해당 리뷰를 확인할 수 없습니다.');
    }

    review.content = content;
    review.rate = rate;

    const updateReview = await this.reviewRepository.save(review);

    return updateReview;
  }

  async remove(id: number, user: User) {
    //해당 user가 id에 해당하는 review의 소유인지 확인하기 위해 user_id도 같이 확인
    const review = await this.reviewRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(review)) {
      throw new NotFoundException('해당 리뷰를 확인할 수 없습니다.');
    }

    //삭제
    await this.reviewRepository.delete({ id });

    return review;
  }
}

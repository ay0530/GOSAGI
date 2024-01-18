import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import _ from 'lodash';
import { OrderService } from 'src/order/order.service';
@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly orderService: OrderService
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User) {
    const {order_id, rate, content} = createReviewDto;

    //해당 order_id가 존재하는지 먼저 확인
    await this.orderService.findOne(order_id, user);

    //order의 status가 구매확정인 경우에만 리뷰 작성 가능
    const status = await this.orderService.getOrderStatus(order_id);

    if(status !== '구매확정'){
      throw new BadRequestException('구매확정이 된 상품만 리뷰를 작성할 수 있습니다.');
    }

    //review 작성
    const createReview = await this.reviewRepository.save({
      content,
      rate,
      order_id,
      user_id: user.id
    });

    return {
      success: true,
      message: '리뷰 작성에 성공하였습니다.',
      data: createReview
    }
  }

  async findAll(user: User) {
    const reviews = await this.reviewRepository.find({
      where: { user_id:user.id },
    })

    return {
      success: true,
      message: "리뷰를 정상적으로 불러왔습니다.",
      data: {
        review_count: reviews.length,
        reviews
      }
    };
  }

  async findOne(id: number, user: User) {

    //해당 user가 id에 해당하는 review의 소유인지 확인하기 위해 user_id도 같이 확인
    const review = await this.reviewRepository.findOne({
      where: { id, user_id:user.id },
    });

    if (_.isNil(review)) {
      throw new NotFoundException('해당 리뷰를 확인할 수 없습니다.');
    }

    return {
      success: true,
      message: '리뷰 내용을 정상적으로 불러왔습니다.',
      data: review
    }
  }

  async findAllByProductId(productId: number){
    //order에서 해당하는 product_id를 찾아 각각 review 등록 여부를 확인하고 불러온다 
    //or productID 역시 저장하게 한다.
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, user: User) {
    const {content, rate} =  updateReviewDto;

    //해당 user가 id에 해당하는 review의 소유인지 확인하기 위해 user_id도 같이 확인
    const review = await this.reviewRepository.findOne({
      where: { id, user_id:user.id },
    });
  
    if (_.isNil(review)) {
      throw new NotFoundException('해당 리뷰를 확인할 수 없습니다.');
    }
  
    review.content = content;
    review.rate = rate;
    
    const updateReview = await this.reviewRepository.save(review);

    return {
      success: true,
      message: '리뷰가 정상적으로 수정되었습니다.',
      data: updateReview
    }
  }

  async remove(id: number, user: User) {
    //해당 user가 id에 해당하는 review의 소유인지 확인하기 위해 user_id도 같이 확인
    const review = await this.reviewRepository.findOne({
      where: { id, user_id:user.id },
    });

    if (_.isNil(review)) {
      throw new NotFoundException('해당 리뷰를 확인할 수 없습니다.');
    }


    //삭제
    await this.reviewRepository.delete({ id });

     return {
      success: true,
      message: '리뷰를 정상적으로 삭제했습니다.',
      data : review
    };
  }
}

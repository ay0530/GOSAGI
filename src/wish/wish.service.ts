import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import _ from 'lodash';
import { abort } from 'process';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createWishDto: CreateWishDto, user: User) {
    const product_id = createWishDto.product_id;

    //같은 유저의 중복 찜 불가
    const wish = await this.wishRepository.find({
      where: { product_id, user_id: user.id },
    });

    if (wish.length) {
      throw new BadRequestException('이미 찜한 상품입니다.');
    }

    //찜 생성 후 return
    const createWish = await this.wishRepository.save({
      product_id: product_id,
      user_id: user.id,
    });

    return createWish;
  }

  async findAll(user: User) {
    const wishes = await this.wishRepository.find({
      where: { user_id: user.id },
    });

    return {
      wishes_count: wishes.length,
      data: wishes,
    };
  }

  async findByProduct(id: number) {
    const wishes = await this.wishRepository.find({
      where: { product_id: id },
    });

    return {
      wishes_count: wishes.length,
    };
  }

  async remove(id: number, user: User) {
    //id를 통해 wish를 찾는다.
    //해당 user가 id에 해당하는 찜을 했는지 확인하기 위해 user_id도 같이 확인
    const wish = await this.wishRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(wish)) {
      throw new NotFoundException('해당 상품은 찜을 하지 않았습니다.');
    }

    //삭제
    await this.wishRepository.delete({ id });

    return wish;
  }
}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
      where: {product_id, user_id:user.id},
    })

    if(wish.length) {
      throw new BadRequestException('이미 찜한 상품입니다.');
    }

    //찜 생성 후 return
    const createWish = await this.wishRepository.save({
      product_id:product_id,
      user_id: user.id
    });

    return {
      success: true,
      message: "찜이 완료되었습니다.",
      createWish
    };
  }

  async findAll(user: User) {
    const wishes = await this.wishRepository.find({
      where: { user_id:user.id },
    })

    return {
      success: true,
      message: "찜을 정상적으로 불러왔습니다.",
      wishes_count: wishes.length,
      wishes
    };
  }

  async findByProduct(id: number) {
    const wishes = await this.wishRepository.find({
      where: { product_id:id },
    })

    return {
      success: true,
      message: "찜을 정상적으로 불러왔습니다.",
      wishes_count: wishes.length,
      wishes
    };
  }

  async remove(id: number, user: User) {
    //id를 통해 wish를 찾는다. 
    const wish = await this.wishRepository.findOne({
      where: { id, user_id:user.id },
    });

    //2. product id를 통해 wish를 찾는다.
    // const wish = await this.wishRepository.findOne({
    //   where: { product_id:id, user_id:user.id },
    // });

    //wish 없다면 에러 메세지
    if (_.isNil(wish)) {
      throw new NotFoundException('해당 상품은 찜을 하지 않았습니다.');
    }

    //삭제
    await this.wishRepository.delete({ id });

     return {
      success: true,
      message: "찜을 정상적으로 삭제했습니다.",
      wish
    };
  }
}

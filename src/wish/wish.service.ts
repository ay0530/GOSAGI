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
import _ from 'lodash';
import { abort } from 'process';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class WishService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly productService: ProductService,
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

    //product가 존재하는지 확인
    const product = await this.productService.getProductInfo(product_id);

    if (!product) {
      throw new NotFoundException('해당하는 상품이 존재하지 않습니다.');
    }
    console.log(product);

    //찜 생성 후 return
    const createWish = await this.wishRepository.save({
      product_id: product_id,
      product,
      user_id: user.id,
    });

    return createWish;
  }

  async findAll(user: User) {
    const wishes = await this.wishRepository.find({
      where: { user_id: user.id },
      select: ['id', 'product_id'],
      relations: ['product'],
    });

    const data = [];
    for (const wish of wishes) {
      const mappedItem = {
        id: wish.id,
        product_id: wish.product_id,
        productCode: wish.product.code,
        productName: wish.product.name,
        productPoint: wish.product.point,
        productPrice: wish.product.price,
        productThumbnail: wish.product.productThumbnail,
        //추가 필요한 매핑 작업 수행
      };
      data.push(mappedItem);
    }

    return {
      wishes_count: wishes.length,
      data,
    };
  }

  async findByProduct(id: number, user: User) {
    const wishes = await this.wishRepository.find({
      where: { product_id: id },
    });

    let isMyWish = false;
    const myWish = await this.wishRepository.findOne({
      where: { product_id: id, user_id: user.id },
    });

    if (myWish !== null) {
      isMyWish = true;
      return {
        wishes_count: wishes.length,
        isMyWish,
        myWishId: myWish.id,
      };
    }

    return {
      wishes_count: wishes.length,
      isMyWish,
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

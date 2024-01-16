import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
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
    const product = await this.productRepository.findOne({
      where: { code:createWishDto.product_code },
    });

    const createWish = await this.wishRepository.save({
      product:product,
      user: user
    });

    return {
      success: true,
      message: "찜이 완료되었습니다.",
      createWish
    };
  }

  findAll() {
    return `This action returns all wish`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wish`;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}

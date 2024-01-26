import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import _ from 'lodash';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createCartDto: CreateCartDto, user: User) {
    const { product_id, quantity } = createCartDto;

    const cart = await this.cartRepository.findOne({
      where: { product_id, user_id: user.id },
    });

    //이미 존재하는 상품에 장바구니를 새로 추가하는 경우 수량만 늘려주고 없는 경우엔 새로 만들어준다.
    if (_.isNil(cart)) {
      const createCart = await this.cartRepository.save({
        product_id,
        user_id: user.id,
        quantity,
      });

      return createCart;
    } else {
      cart.quantity += quantity;
      const createCart = await this.cartRepository.save(cart);

      return createCart;
    }
  }

  async findAll(user: User) {
    const carts = await this.cartRepository.find({
      where: { user_id: user.id },
    });

    const data = [];
    //mapping해서 product 내용도 일부 가져온다.
    for (const cart of carts) {
      const product = await this.productRepository.findOne({
        where: { id: cart.product_id },
      });

      const mappedItem = {
        id: cart.id,
        product_id: cart.product_id,
        user_id: cart.user_id,
        productName: product.name,
        productPoint: product.point,
        productStore: product.store_id,
        quantity: cart.quantity,
        // 추가 필요한 매핑 작업 수행
      };

      data.push(mappedItem);
    }
    return {
      cart_count: carts.length,
      data,
    };
  }

  async findOne(id: number, user: User) {
    //해당 user가 id에 해당하는 cart의 소유인지 확인하기 위해 user_id도 같이 확인
    const cart = await this.cartRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(cart)) {
      throw new NotFoundException(
        '해당 상품의 장바구니 내역을 확인할 수 없습니다.',
      );
    }

    const product = await this.productRepository.findOne({
      where: { id: cart.product_id },
    });

    const mappedItem = {
      id: cart.id,
      product_id: cart.product_id,
      user_id: cart.user_id,
      productName: product.name,
      productPoint: product.point,
      productDescription: product.description,
      productLocation: product.location,
      productCategory: product.category,
      productStore: product.store_id,
      quantity: cart.quantity,
      // 추가 필요한 매핑 작업 수행
    };

    return mappedItem;
  }

  async update(id: number, updateCartDto: UpdateCartDto, user: User) {
    //해당 user가 id에 해당하는 cart의 소유인지 확인하기 위해 user_id도 같이 확인
    const cart = await this.cartRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(cart)) {
      throw new NotFoundException(
        '해당 상품의 장바구니 내역을 확인할 수 없습니다.',
      );
    }

    //수량만큼 업데이트
    cart.quantity = updateCartDto.quantity;
    const updateCart = await this.cartRepository.save(cart);

    return updateCart;
  }

  async remove(id: number, user: User) {
    //해당 user가 id에 해당하는 cart의 소유인지 확인하기 위해 user_id도 같이 확인
    const cart = await this.cartRepository.findOne({
      where: { id, user_id: user.id },
    });

    if (_.isNil(cart)) {
      throw new NotFoundException(
        '해당 상품의 장바구니 내역을 확인할 수 없습니다.',
      );
    }

    //삭제
    await this.cartRepository.delete({ id });

    return cart;
  }
}

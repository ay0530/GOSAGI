import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Not, Repository } from 'typeorm';

import { RedisViewsService } from 'src/redis/redis-views.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Wish } from 'src/wish/entities/wish.entity';
import { Order } from 'src/order/entities/order.entity';
import { Review } from 'src/review/entities/review.entity';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisViewsService: RedisViewsService,
    private readonly storeService: StoreService,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    storeId: number,
    userId: number,
  ) {
    const {
      code,
      name,
      description,
      location,
      category,
      point,
      price,
      thumbnail_image,
      productThumbnails,
      productContents,
    } = createProductDto;

    const store = await this.storeService.findOne(storeId);

    //store가 존재하고, 그 주인만이 상품을 올릴 수 있다.
    if (!store || store.aproval_status !== 1) {
      throw new NotFoundException('해당 상점을 확인할 수 없습니다.');
    }

    if (store.user_id !== userId) {
      throw new ForbiddenException(
        '해당 상점에 상품을 등록할 수 있는 권한이 없습니다.',
      );
    }

    return await this.productRepository.save({
      code,
      name,
      description,
      location,
      category,
      point,
      price,
      store_id: storeId,
      thumbnail_image,
      productThumbnail: productThumbnails.map(
        (productThumbnail) => productThumbnail,
      ),
      productContent: productContents.map((productContent) => productContent),
    });
  }

  async findAll() {
    return await this.productRepository.find({
      select: {
        name: true,
        description: true,
        location: true,
        point: true,
        price: true,
        thumbnail_image: true,
      },
      where: { id: Not(0) },
    });
  }

  async findProductCode(productId: number) {
    return await this.productRepository.find({
      select: {
        code: true,
      },
      where: {
        id: productId,
      },
    });
  }

  async findByRegion(location: string) {
    return await this.productRepository.find({
      where: {
        location: Like(`%${location}%`),
      },
    });
  }

  async findByCategory(categoryId: string) {
    return await this.productRepository.find({
      where: {
        category: categoryId,
      },
    });
  }

  // 상품 정보 상세 조회
  async getProductDetail(productId: number, userId: number) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations: {
        productThumbnail: true,
        productContent: true,
      },
    });

    this.recentProduct(productId, userId, product.thumbnail_image);
    return product;
  }

  async findByProductKeyword(keyword: string) {
    return await this.productRepository.find({
      where: [
        { name: Like(`%${keyword}%`) },
        { description: Like(`%${keyword}%`) },
      ],
    });
  }

  //orders테이블 까지 보류 (테이블 관의 관계가 없음)
  async getProductsByReviewRate() {
    return await this.dataSource
      .createQueryBuilder(Product, 'p')
      .select('p.*')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .groupBy('p.id')
      .having('average_rate IS NOT NULL')
      .orderBy('average_rate', 'DESC')
      .limit(4)
      .getRawMany();
  }

  //orders테이블 까지 보류
  async getProdcutByOrders() {
    return await this.dataSource
      .createQueryBuilder()
      .select('p.*')
      .addSelect('COUNT(o.product_id) as number_of_purchase')
      .from(Product, 'p')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .where(
        `o.status IS NOT NULL 
        AND (o.status = :status1 OR
          o.status = :status2)`,
        {
          status1: '구매완료',
          status2: '구매확정',
        },
      )
      .groupBy('p.id')
      .orderBy('number_of_purchase', 'DESC')
      .limit(4)
      .getRawMany();
  }

  async getProductByViewsAndLike() {
    return await this.dataSource
      .createQueryBuilder()
      .select('p.*')
      .addSelect('COUNT(w.product_id) + SUM(p.views) as best_products')
      .from(Product, 'p')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .groupBy('p.id')
      .orderBy('best_products', 'DESC')
      .limit(4)
      .getRawMany();
  }

  async getProductByLike() {
    return await this.dataSource
      .createQueryBuilder()
      .select('p.*')
      .addSelect('COUNT(w.product_id)', 'wish_count')
      .from(Product, 'p')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .groupBy('p.id')
      .orderBy('wish_count', 'DESC')
      .limit(4)
      .getRawMany();
  }

  async getProductByViews() {
    return await this.productRepository.find({
      order: {
        views: 'DESC',
      },
      take: 4,
    });
  }

  async update(productId: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('수정하려는 상품이 존재하지 않습니다.');
    }

    return await this.dataSource
      .createQueryBuilder()
      .update(Product)
      .set({ ...updateProductDto })
      .where(`id = ${productId}`)
      .execute();
  }

  async increaseView(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('선택하신 상품이 존재하지 않습니다.');
    }

    return await this.productRepository.increment(
      {
        id: productId,
      },
      'views',
      +1,
    );
  }

  async remove(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('삭제하려는 상품이 존재하지 않습니다.');
    }

    await this.productRepository.remove(product);

    return '정상적으로 삭제되었습니다';
  }

  // 최근 본 상품 저장
  async recentProduct(
    productId: any,
    userId: any,
    ProductThumbnail: string,
  ): Promise<void> {
    const key = `user:${userId}:recentViews`;
    await this.redisViewsService.lpush(key, `${productId};${ProductThumbnail}`); // lPush : 리스트 시작 부분에 값을 추가
    await this.redisViewsService.ltrim(key, 0, 4); // lTrim : 리스트의 크기 조정
  }

  // 최근 본 상품 조회
  async getRecentViews(userId: string): Promise<string[]> {
    const key = `user:${userId}:recentViews`;
    return await this.redisViewsService.lrange(key, 0, 4); // lTrim : 리스트의 크기 조정
  }

  // ---- 기타 함수
  // 매장의 상품 목록 조회
  async findProductAllByStore(storeId: number) {
    const products = await this.productRepository.find({
      where: { store_id: storeId },
    });

    return products;
  }

  // 매장 상품 목록 검색 조회
  async searchProductAllByStore(
    storeId: number,
    category: string,
    keyword: string,
  ) {
    // 매장명으로 검색 가능
    const products = this.productRepository
      .createQueryBuilder('product')
      .where(`product.${category} LIKE :keyword`, {
        keyword: `%${keyword}%`,
      })
      .andWhere(`product.store_id = :storeId`, { storeId })
      .getMany();

    return products;
  }

  // 상품 번호 목록 조회
  async findProductIds(storeId: number) {
    // 상품 번호 목록 조회
    const products = await this.productRepository.find({
      select: ['id'],
      where: { store_id: storeId },
    });

    // 상품 번호 추출
    const productIds = products.map((product) => product.id);

    return productIds;
  }
}

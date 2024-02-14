import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Like, Repository } from 'typeorm';

import { RedisViewsService } from 'src/redis/redis-views.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Wish } from 'src/wish/entities/wish.entity';
import { Order } from 'src/order/entities/order.entity';
import { Review } from 'src/review/entities/review.entity';
import { StoreService } from 'src/store/store.service';

const pageLimit = 12;
@Injectable()
export class ProductService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisViewsService: RedisViewsService,
    private readonly storeService: StoreService,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  // 일반 상품 등록
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
      business_code,
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
      business_code,
    });
  }

  // 상품 코드로 조회
  async findProductByCode(code: number) {
    return await this.productRepository.find({
      where: {
        code,
      },
    });
  }

  // 상품 정보 상세 조회
  async getProductDetail(productId: number) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations: {
        productThumbnail: true,
        productContent: true,
      },
    });
    return product;
  }

  // 상품 정보 상세 조회
  async getProductInfo(productId: number) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });

    return product;
  }

  // 전체 상품 개수 조회
  async findAllCount() {
    const count = await this.dataSource
      .createQueryBuilder(Product, 'p')
      .where('p.id>1')
      .getCount();

    return count;
  }

  // 전체 상품 목록 조회
  async findAll(page: number) {
    return await this.dataSource
      .createQueryBuilder(Product, 'p')
      .select('p.*')
      .addSelect('COUNT(DISTINCT w.id) as wish_count')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .addSelect('COUNT(DISTINCT r.id) as review_count')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .groupBy('p.id')
      .where('p.id != :id', { id: 1 }) // product_id가 1인 항목을 제외
      .limit(pageLimit)
      .offset((page - 1) * pageLimit)
      .getRawMany();
  }

  // 지역 별 상품 개수 조회
  async findByRegionCount(location: string) {
    const count = await this.dataSource
      .createQueryBuilder(Product, 'p')
      .where('p.location LIKE :location', { location: `%${location}%` })
      .andWhere('p.id>1')
      .getCount();

    return count;
  }

  // 지역 별 상품 목록 조회
  async findByRegion(location: string, page: number) {
    return await this.dataSource
      .createQueryBuilder(Product, 'p')
      .select('p.*')
      .addSelect('COUNT(DISTINCT w.id) as wish_count')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .addSelect('COUNT(DISTINCT r.id) as review_count')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .where('p.location LIKE :location', { location: `%${location}%` })
      .andWhere('p.id>1')
      .groupBy('p.id')
      .limit(pageLimit)
      .offset((page - 1) * pageLimit)
      .getRawMany();
  }

  // 카테고리 별 상품 개수 조회
  async findByCategoryCount(categoryId: string) {
    const count = await this.dataSource
      .createQueryBuilder(Product, 'p')
      .where('p.category = :categoryId', { categoryId })
      .andWhere('p.id>1')
      .getCount();

    return count;
  }

  // 카테고리 별 상품 목록 조회
  async findByCategory(categoryId: string, page: number) {
    console.log('categoryId: ', categoryId);
    return await this.dataSource
      .createQueryBuilder(Product, 'p')
      .select('p.*')
      .addSelect('COUNT(DISTINCT w.id) as wish_count')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .addSelect('COUNT(DISTINCT r.id) as review_count')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .where('p.category = :categoryId', { categoryId })
      .andWhere('p.id>1')
      .groupBy('p.id')
      .limit(pageLimit)
      .offset((page - 1) * pageLimit)
      .getRawMany();
  }

  // 상품 검색 개수 조회
  async findByKeywordCount(keyword: string) {
    const count = await this.dataSource
      .createQueryBuilder(Product, 'p')
      .where(
        new Brackets((qb) => {
          qb.where('p.name like :keyword', {
            keyword: `%${keyword}%`,
          }).orWhere('p.name like :keyword', { keyword: `%${keyword}%` });
        }),
      )
      .andWhere('p.id>1')
      .getCount();

    return count;
  }

  // 상품 검색 조회
  async findByProductKeyword(keyword: string, page: number) {
    return await this.dataSource
      .createQueryBuilder(Product, 'p')
      .select('p.*')
      .addSelect('COUNT(w.product_id) as wish_count')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .addSelect('COUNT(r.id) as review_count')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .where(
        new Brackets((qb) => {
          qb.where('p.name like :keyword', {
            keyword: `%${keyword}%`,
          }).orWhere('p.name like :keyword', { keyword: `%${keyword}%` });
        }),
      )
      .andWhere('p.id>1')
      .groupBy('p.id')
      .limit(pageLimit)
      .offset((page - 1) * pageLimit)
      .getRawMany();
  }

  //orders테이블 까지 보류 (테이블 관의 관계가 없음)
  async getProductsByReviewRate() {
    return await this.dataSource
      .createQueryBuilder(Product, 'p')
      .select('p.*')
      .addSelect('COUNT(DISTINCT w.id) as wish_count')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .addSelect('COUNT(DISTINCT r.id) as review_count')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .groupBy('p.id')
      .having('average_rate IS NOT NULL')
      .orderBy('average_rate', 'DESC')
      .limit(4)
      .getRawMany();
  }

  //orders테이블 까지 보류
  async getProductByOrders() {
    return await this.dataSource
      .createQueryBuilder()
      .select('p.*')
      .addSelect('COUNT(o.product_id) as number_of_purchase')
      .from(Product, 'p')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .addSelect('COUNT(DISTINCT r.id) as review_count')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .addSelect('COUNT(DISTINCT w.id) as wish_count')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
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
      .addSelect('COUNT(DISTINCT w.id) as wish_count')
      .from(Product, 'p')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .addSelect('COUNT(DISTINCT r.id) as review_count')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .groupBy('p.id')
      .orderBy('best_products', 'DESC')
      .limit(4)
      .getRawMany();
  }

  async getProductByLike() {
    return await this.dataSource
      .createQueryBuilder()
      .select('p.*')
      .addSelect('COUNT(DISTINCT w.id)', 'wish_count')
      .from(Product, 'p')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .addSelect('COUNT(DISTINCT r.id) as review_count')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .groupBy('p.id')
      .orderBy('wish_count', 'DESC')
      .limit(4)
      .getRawMany();
  }

  async getProductByViews() {
    return await this.dataSource
      .createQueryBuilder()
      .select('p.*')
      .addSelect('COUNT(DISTINCT w.id)', 'wish_count')
      .from(Product, 'p')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .addSelect('COUNT(DISTINCT r.id) as review_count')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .groupBy('p.id')
      .orderBy('p.views', 'DESC')
      .limit(4)
      .getRawMany();
  }

  async update(productId: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
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
      business_code,
    } = updateProductDto;

    if (!product) {
      throw new NotFoundException('수정하려는 상품이 존재하지 않습니다.');
    }

    product.code = code;
    product.name = name;
    product.description = description;
    product.location = location;
    product.category = category;
    product.point = point;
    product.price = price;
    product.thumbnail_image = thumbnail_image;
    product.business_code = business_code;
    return await this.productRepository.save(product);
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

  // // 최근 본 상품 저장
  // async recentProduct(
  //   productId: any,
  //   userId: any,
  //   ProductThumbnail: string,
  // ): Promise<void> {
  //   const key = `user:${userId}:recentViews`;
  //   await this.redisViewsService.lpush(key, `${productId};${ProductThumbnail}`); // lPush : 리스트 시작 부분에 값을 추가
  //   await this.redisViewsService.ltrim(key, 0, 4); // lTrim : 리스트의 크기 조정
  // }

  // 최근 본 상품 조회
  async getRecentViews(userId: string): Promise<string[]> {
    const key = `user:${userId}:recentViews`;
    return await this.redisViewsService.lrange(key, 0, 4); // lTrim : 리스트의 크기 조정
  }

  // ---- 기타 함수
  // 매장의 상품 목록 조회
  async findProductAllByStore(storeId: number, page: number) {
    const products = this.dataSource
      .createQueryBuilder(Product, 'p')
      .select('p.*')
      .addSelect('COUNT(DISTINCT w.id) as wish_count')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .addSelect('COUNT(DISTINCT r.id) as review_count')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .groupBy('p.id')
      .where(`p.store_id = :storeId`, { storeId })
      .andWhere('p.id != :id', { id: 1 })
      .limit(pageLimit)
      .offset((page - 1) * pageLimit)
      .getRawMany();

    return products;
  }

  async findProductCountByStore(storeId: number) {
    const count = this.dataSource
      .createQueryBuilder(Product, 'p')
      .where(`p.store_id = :storeId`, { storeId })
      .getCount();

    return count;
  }

  // 매장 상품 목록 검색 조회
  async searchProductAllByStore(
    storeId: number,
    category: string,
    keyword: string,
    page: number,
  ) {
    // 매장명으로 검색 가능
    const products = this.dataSource
      .createQueryBuilder(Product, 'p')
      .select('p.*')
      .addSelect('COUNT(w.product_id) as wish_count')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .addSelect('ROUND(AVG(r.rate), 2) as average_rate')
      .addSelect('COUNT(r.id) as review_count')
      .leftJoin(Order, 'o', 'o.product_id = p.id')
      .leftJoin(Review, 'r', 'r.order_id = o.id')
      .where(`p.${category} LIKE :keyword`, {
        keyword: `%${keyword}%`,
      })
      .andWhere(`p.store_id = :storeId`, { storeId })
      .limit(pageLimit)
      .offset((page - 1) * pageLimit)
      .getRawMany();

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

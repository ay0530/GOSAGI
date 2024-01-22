import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Like, Not, Or, Repository } from 'typeorm';
import { Wish } from 'src/wish/entities/wish.entity';
import { Order } from 'src/order/entities/order.entity';
import { Review } from 'src/review/entities/review.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  //스토어가 있는지에 대한 유효성 검사 추가 예정
  async create(createProductDto: CreateProductDto, storeId: number) {
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

  async getProductDetail(productId: number) {
    return await this.productRepository.find({
      where: {
        id: productId,
      },
      relations: {
        productThumbnail: true,
        productContent: true,
      },
    });
  }

  async findByProductKeyword(keyword: string){
    return await this.productRepository.find({
      where:[ 
        {name: Like(`%${keyword}%`)},
        {description: Like(`%${keyword}%`)}  
      ]
    })
  }

  //orders테이블 까지 보류 (테이블 관의 관계가 없음)
  async getProductsByReviewRate(){
    return await this.dataSource.createQueryBuilder(Product, 'p')
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
  async getProdcutByOrders(){
    return await this.dataSource.createQueryBuilder()
    .select('p.*')
    .addSelect('COUNT(o.product_id) as number_of_purchase')
    .from(Product, 'p')
    .leftJoin(Order, 'o', 'o.product_id = p.id')
    .where(`o.status IS NOT NULL 
        AND (o.status = :status1 OR
          o.status = :status2)`, {
        status1: '구매완료', 
        status2: '구매확정'
      })
    .groupBy('p.id')    
    .orderBy('number_of_purchase', 'DESC')
    .limit(4)
    .getRawMany()
  }


  async getProductByViewsAndLike(){
      return await this.dataSource.createQueryBuilder()
      .select('p.*')
      .addSelect('COUNT(w.product_id) + SUM(p.views) as best_products')
      .from(Product, 'p')
      .leftJoin(Wish, 'w', 'w.product_id = p.id')
      .groupBy('p.id')
      .orderBy('best_products', 'DESC')
      .limit(4)
      .getRawMany()
    }
  
  async getProductByLike(){
    return await this.dataSource.createQueryBuilder()
    .select('p.*')
    .addSelect('COUNT(w.product_id)', 'wish_count')
    .from(Product, 'p')
    .leftJoin(Wish, 'w', 'w.product_id = p.id')
    .groupBy('p.id')
    .limit(4)
    .getRawMany();
  }

  async getProductByViews(){
    return await this.productRepository.find({
      order: {
        views: "DESC"
      },
      take: 4,
    })    
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

  async increaseView(productId: number){
    
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('선택하신 상품이 존재하지 않습니다.');
    }

    return await this.productRepository.increment({
      id: productId,
    }, "views", +1)
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

  // ---- 기타 함수
  // 매장의 상품 목록 조회
  async findProductAll(storeId: number) {
    const products = await this.productRepository.find({
      where: { store_id: storeId },
    });

    return products;
  }

  // 매장 상품 목록 검색 조회
  async searchProductAll(storeId: number, category: string, keyword: string) {
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

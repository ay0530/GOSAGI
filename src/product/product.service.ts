import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Like, Repository } from 'typeorm';

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

    console.log(productThumbnails);

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

  async remove(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('삭제하려는 상품이 존재하지 않습니다.');
    }

    await this.productRepository.remove(product);

    return '정삭적으로 삭제되었습니다';
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

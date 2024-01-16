import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { take } from 'lodash';

@Injectable()
export class ProductService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Product) private productRepository:Repository<Product>,
  ){}

  //스토어가 있는지에 대한 유효성 검사 추가 예정
  async create(createProductDto: CreateProductDto, storeId: number) {
    const {code, 
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

        console.log(productThumbnails)
    
    
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
      productThumbnail: productThumbnails.map((productThumbnail) => productThumbnail),
      productContent: productContents.map((productContent) => productContent),
      });
  }

  async findAll() {

    return await this.productRepository.find({
      select: {
        name:true,
        description: true,
        location: true,
        point: true,
        price: true,
        thumbnail_image: true,
      },
      })
  }

  async findProductCode(productId:number){
    return await this.productRepository.find({
      select: {
        code: true
      },
      where: {
        id:productId
      }

    })
  }


  async findByRegion(location: string) {

    return await this.productRepository.find({
      where: { 
        location: Like(`%${location}%`)
      }
    })
  }

  async findByCategory(categoryId: string){

    return await this.productRepository.find({
      where: {
        category: categoryId,
      }
    })
  }


  async getProductCotents(productId: number) {
    return await this.productRepository.find({
      where: {
        id: productId,
      },
      relations: {
        productContent: true
      }
    })

  }

  async update(productId: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: {id: productId}
    })

    if(!product){
      throw new NotFoundException('수정하려는 상품이 존재하지 않습니다.');
    }
    
    return await this.dataSource.createQueryBuilder()
    .update(Product)
    .set({...updateProductDto})
    .where(`id = ${productId}`)
    .execute()
    
  }

  async remove(productId: number) {
    
    const product = await this.productRepository.findOne({
      where: {id: productId}
    })

    if(!product){
      throw new NotFoundException('삭제하려는 상품이 존재하지 않습니다.');
    }
    
    await this.productRepository.remove(product);
    
    return '정삭적으로 삭제되었습니다'
  }
}

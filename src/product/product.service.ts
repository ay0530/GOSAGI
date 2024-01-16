import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';

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
          productThumbnails,
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
      storeId,
      productThumbnail: productThumbnails.map((productThumbnail) => productThumbnail),
      });
  }

  async findAll() {
    
    return await this.productRepository.find({
      select: {
        
      }

    })
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}

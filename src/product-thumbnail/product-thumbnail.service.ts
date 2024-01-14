import { Injectable } from '@nestjs/common';
import { CreateProductThumbnailDto } from './dto/create-product-thumbnail.dto';
import { UpdateProductThumbnailDto } from './dto/update-product-thumbnail.dto';

@Injectable()
export class ProductThumbnailService {
  create(createProductThumbnailDto: CreateProductThumbnailDto) {
    return 'This action adds a new productThumbnail';
  }

  findAll() {
    return `This action returns all productThumbnail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productThumbnail`;
  }

  update(id: number, updateProductThumbnailDto: UpdateProductThumbnailDto) {
    return `This action updates a #${id} productThumbnail`;
  }

  remove(id: number) {
    return `This action removes a #${id} productThumbnail`;
  }
}

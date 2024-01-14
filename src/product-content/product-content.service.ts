import { Injectable } from '@nestjs/common';
import { CreateProductContentDto } from './dto/create-product-content.dto';
import { UpdateProductContentDto } from './dto/update-product-content.dto';

@Injectable()
export class ProductContentService {
  create(createProductContentDto: CreateProductContentDto) {
    return 'This action adds a new productContent';
  }

  findAll() {
    return `This action returns all productContent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productContent`;
  }

  update(id: number, updateProductContentDto: UpdateProductContentDto) {
    return `This action updates a #${id} productContent`;
  }

  remove(id: number) {
    return `This action removes a #${id} productContent`;
  }
}

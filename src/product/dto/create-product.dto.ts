import { PickType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductThumbnailDto } from './create-product-thumbnail.dto';
import { CreateProductContentDto } from './create-product-content.dto';

export class CreateProductDto extends PickType(Product, [
  'code',
  'name',
  'description',
  'location',
  'category',
  'point',
  'price',
  'thumbnail_image',
]) {
  @ValidateNested()
  @Type(() => CreateProductThumbnailDto)
  productThumbnails: CreateProductThumbnailDto[];

  @ValidateNested()
  @Type(() => CreateProductContentDto)
  productContents: CreateProductContentDto[];
}

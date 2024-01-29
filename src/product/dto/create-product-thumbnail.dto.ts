import { PickType } from '@nestjs/swagger';
import { ProductThumbnail } from 'src/product/entities/product-thumbnail.entity';

export class CreateProductThumbnailDto extends PickType(ProductThumbnail, [
  'image_url',
]) {}

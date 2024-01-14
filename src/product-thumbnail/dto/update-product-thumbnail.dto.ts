import { PartialType } from '@nestjs/swagger';
import { CreateProductThumbnailDto } from './create-product-thumbnail.dto';

export class UpdateProductThumbnailDto extends PartialType(CreateProductThumbnailDto) {}

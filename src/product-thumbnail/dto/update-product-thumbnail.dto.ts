import { PartialType } from '@nestjs/swagger';
import { CreateProductThumbnailDto } from '../../product/dto/create-product-thumbnail.dto';

export class UpdateProductThumbnailDto extends PartialType(CreateProductThumbnailDto) {}

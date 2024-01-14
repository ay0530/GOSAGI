import { PartialType } from '@nestjs/swagger';
import { CreateProductContentDto } from './create-product-content.dto';

export class UpdateProductContentDto extends PartialType(CreateProductContentDto) {}

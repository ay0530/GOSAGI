import { PartialType } from '@nestjs/swagger';
import { CreateProductContentDto } from '../../product/dto/create-product-content.dto';

export class UpdateProductContentDto extends PartialType(CreateProductContentDto) {}

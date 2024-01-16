import { PickType } from "@nestjs/swagger";
import { Product } from "../entities/product.entity";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateProductThumbnailDto } from "./create-product-thumbnail.dto";


export class CreateProductDto extends PickType(Product, ['code', 
'name', 
'description',
'location',
'category',
'point',
'price',
]) {
  @ValidateNested()
  @Type(()=> CreateProductThumbnailDto)
  productThumbnails: CreateProductThumbnailDto[];
}

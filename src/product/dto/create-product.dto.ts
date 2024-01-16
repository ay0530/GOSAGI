import { PickType } from "@nestjs/swagger";
import { Product } from "../entities/product.entity";

export class CreateProductDto extends PickType(Product, ['code', 
'name', 
'description',
'location',
'category',
'point',
'price',
'views',
]) {

}

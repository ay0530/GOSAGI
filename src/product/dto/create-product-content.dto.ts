import { PickType } from "@nestjs/swagger";
import { ProductContent } from "../entities/product-content.entity";

export class CreateProductContentDto extends PickType(ProductContent, ['content']){}

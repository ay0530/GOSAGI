import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('goods')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(":storeId")
  async create(
    @Body() createProductDto: CreateProductDto,
    @Param("storeId") storeId: number,
    ) {
    const data = await this.productService.create(createProductDto, storeId);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: '상품 등록완료',
      data,
    }
  }

  //상품 전체 가져오기
  @Get()
  async findAll() {
    const data =  await this.productService.findAll();
    
    return {
      statusCode: HttpStatus.OK,
      message: '상품 조회',
      data,
    }
  }

  @Get("/code/:productId")
  async findProductCode(@Param("productId") productId:number){
    const data = await this.productService.findProductCode(productId)

    return {
      statusCode: HttpStatus.OK,
      message: '상품 조회',
      data,
    }
  }

  @Get("/location")
  async findByRegion(@Query('location') location:string){
    const data = await this.productService.findByRegion(location)
    return {
      statusCode: HttpStatus.OK,
      message: '상품 조회',
      data,
    }
  }

  @Get("/category/:categotyId")
  async findByCategoty(@Param("categotyId") categoryId: string){
    const data = await this.productService.findByCategory(categoryId)

    return {
      statusCode: HttpStatus.OK,
      message: '상품 조회',
      data,
    }
  }

  @Get('/content/:productId')
  async getProductCotents(@Param('productId') productId: number) {
    const data = await this.productService.getProductCotents(productId);
    
    return {
      statusCode: HttpStatus.OK,
      message: '상품 조회',
      data,
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}

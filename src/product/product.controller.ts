import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
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

  @Get()
  async findAll() {
    const data =  await this.productService.findAll();
    
    return {
      statusCode: HttpStatus.CREATED,
      message: '상품 등록완료',
      data,
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
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

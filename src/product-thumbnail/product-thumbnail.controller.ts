import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductThumbnailService } from './product-thumbnail.service';
import { CreateProductThumbnailDto } from './dto/create-product-thumbnail.dto';
import { UpdateProductThumbnailDto } from './dto/update-product-thumbnail.dto';

@Controller('product-thumbnail')
export class ProductThumbnailController {
  constructor(private readonly productThumbnailService: ProductThumbnailService) {}

  @Post()
  create(@Body() createProductThumbnailDto: CreateProductThumbnailDto) {
    return this.productThumbnailService.create(createProductThumbnailDto);
  }

  @Get()
  findAll() {
    return this.productThumbnailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productThumbnailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductThumbnailDto: UpdateProductThumbnailDto) {
    return this.productThumbnailService.update(+id, updateProductThumbnailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productThumbnailService.remove(+id);
  }
}

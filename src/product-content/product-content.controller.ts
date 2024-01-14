import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductContentService } from './product-content.service';
import { CreateProductContentDto } from './dto/create-product-content.dto';
import { UpdateProductContentDto } from './dto/update-product-content.dto';

@Controller('product-content')
export class ProductContentController {
  constructor(private readonly productContentService: ProductContentService) {}

  @Post()
  create(@Body() createProductContentDto: CreateProductContentDto) {
    return this.productContentService.create(createProductContentDto);
  }

  @Get()
  findAll() {
    return this.productContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productContentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductContentDto: UpdateProductContentDto) {
    return this.productContentService.update(+id, updateProductContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productContentService.remove(+id);
  }
}

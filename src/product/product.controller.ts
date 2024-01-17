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
import { ResponseDto } from 'src/ResponseDTO/response-dto';

@Controller('goods')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(":storeId")
  async create(
    @Body() createProductDto: CreateProductDto,
    @Param("storeId") storeId: number,
    ) {
    const data = await this.productService.create(createProductDto, storeId);
    
    const response = new ResponseDto(true, '상품이 등록완료되었습니다', data)

    return response
  }

  //상품 전체 가져오기
  @Get()
  async findAll() {
    const data =  await this.productService.findAll();
    
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  @Get("/code/:productId")
  async findProductCode(@Param("productId") productId:number){
    const data = await this.productService.findProductCode(productId)

    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response

  }

  @Get("/location")
  async findByRegion(@Query('location') location:string){
    const data = await this.productService.findByRegion(location)
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  @Get("/category/:categotyId")
  async findByCategoty(@Param("categotyId") categoryId: string){
    const data = await this.productService.findByCategory(categoryId)

    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  @Get('/detail/:productId')
  async getProductDetail(@Param('productId') productId: number) {
    const data = await this.productService.getProductDetail(productId);
    
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  @Patch(':productId')
  async update(@Param('productId') productId: number, @Body() updateProductDto: UpdateProductDto) {
    const data = await this.productService.update(productId, updateProductDto);

    const response = new ResponseDto(true, '상품수정이 완료되었습니다', data)

    return response
  }

  @Delete(':productId')
  async remove(@Param('productId') productId: number) {
    await this.productService.remove(productId);
    
    
    const response = new ResponseDto(true, '상품삭제가 완료되었습니다.', null)

    return response
  }
}

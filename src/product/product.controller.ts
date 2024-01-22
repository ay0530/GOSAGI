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

  //상품 등록하기
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

  //상품 코드 가져오기
  @Get("/code/:productId")
  async findProductCode(@Param("productId") productId:number){
    const data = await this.productService.findProductCode(productId)

    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response

  }

  //지역으로 검색하기
  @Get("/location")
  async findByRegion(@Query('location') location:string){
    const data = await this.productService.findByRegion(location)
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  //카테고리 별로 가져오기
  @Get("/category/:categotyId")
  async findByCategoty(@Param("categotyId") categoryId: string){
    const data = await this.productService.findByCategory(categoryId)

    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  //상품 상세조회하기 (content도 가져오기)
  @Get('/detail/:productId')
  async getProductDetail(@Param('productId') productId: number) {
    const data = await this.productService.getProductDetail(productId);
    
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  //상품 키워드 검색기능
  @Get('keyword')
  async findByProductKeyword(@Query('keyword') keyword: string){
    console.log(keyword)
    const data = await this.productService.findByProductKeyword(keyword)
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  
  //리뷰 평점 순으로 4개 가져오기(오더 테이블이 있어야됨) 리뷰평점이랑 관계가 없음!!
  @Get('reviewRate')
  async getProductsByReviewRate(){
    const data = await this.productService.getProductsByReviewRate()
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  //구매 완료 개수 순으로 4개(오더 테이블이 있어야됨)
  async getProdcutByOrders(){
    const data = await this.productService.getProdcutByOrders()
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  //조회수 찜수 평균 점수
  @Get('bestProducts')
  async getProductByViewsAndLike(){
    const data = await this.productService.getProductByViewsAndLike()
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  //찜순 4개 조회
  @Get('wishes')
  async getProductByLike(){
    const data = await this.productService.getProductByLike()
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response

  }

  //조회수순 4개 조회
  @Get('views')
  async getProductByViews(){
    const data =  await this.productService.getProductByViews()
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data)

    return response
  }

  //상품 수정(미사용)
  @Patch(':productId')
  async update(@Param('productId') productId: number, @Body() updateProductDto: UpdateProductDto) {
    const data = await this.productService.update(productId, updateProductDto);

    const response = new ResponseDto(true, '상품수정이 완료되었습니다', null)

    return response
  }

  //상품 삭제(미사용)
  @Delete(':productId')
  async remove(@Param('productId') productId: number) {
    await this.productService.remove(productId);
    
    
    const response = new ResponseDto(true, '상품삭제가 완료되었습니다.', null)

    return response
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt.guard';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseDto } from 'src/ResponseDTO/response-dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/user/types/userRole.type';

@Controller('goods')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //상품 등록하기

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Post(':storeId')
  async create(
    @Body() createProductDto: CreateProductDto,
    @Param('storeId') storeId: number,
    @Req() req: any,
  ) {
    const data = await this.productService.create(
      createProductDto,
      storeId,
      req.user.id,
    );

    const response = new ResponseDto(true, '상품이 등록완료되었습니다', data);

    return response;
  }

  //상품 전체 가져오기
  @Get()
  async findAll(@Query('page') page: number) {
    const data = await this.productService.findAll(page);

    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data);

    return response;
  }

  //상품 코드 가져오기
  @Get('/code/:productId')
  async findProductCode(@Param('productId') productId: number) {
    const data = await this.productService.findProductCode(productId);

    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data);

    return response;
  }

  //지역으로 검색하기
  @Get('/location')
  async findByRegion(
    @Query('location') location: string,
    @Query('page') page: number,
  ) {
    const data = await this.productService.findByRegion(location, page);
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data);

    return response;
  }

  //카테고리 별로 가져오기
  @Get('/category/:categoryId')
  async findByCategoty(
    @Param('categoryId') categoryId: string,
    @Query('page') page: number,
  ) {
    const data = await this.productService.findByCategory(categoryId, page);

    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data);

    return response;
  }

  //상품 상세조회하기 (content도 가져오기)
  @UseGuards(JwtAuthGuard)
  @Get('/detail/:productId')
  async getProductDetail(
    @Param('productId') productId: number,
    @Req() req: any,
  ) {
    const data = await this.productService.getProductDetail(
      productId,
      req.user.id,
    );
    await this.productService.increaseView(productId);

    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data);

    return response;
  }

  //상품 키워드 검색기능
  @Get('keyword')
  async findByProductKeyword(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
  ) {
    console.log(keyword);
    const data = await this.productService.findByProductKeyword(keyword, page);
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data);

    return response;
  }

  //리뷰 평점 순으로 4개 가져오기(오더 테이블이 있어야됨) 리뷰평점이랑 관계가 없음!!
  @Get('reviewRate')
  async getProductsByReviewRate() {
    const data = await this.productService.getProductsByReviewRate();
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data);

    return response;
  }

  //구매 완료 개수 순으로 4개(오더 테이블이 있어야됨)
  @Get('bestOrders')
  async getProdcutByOrders() {
    const data = await this.productService.getProdcutByOrders();
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data);

    return response;
  }

  //조회수 찜수 평균 점수
  @Get('bestProducts')
  async getProductByViewsAndLike() {
    const data = await this.productService.getProductByViewsAndLike();
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data);

    return response;
  }

  //찜순 4개 조회
  @Get('wishes')
  async getProductByLike() {
    const data = await this.productService.getProductByLike();
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data);

    return response;
  }

  //조회수순 4개 조회
  @Get('views')
  async getProductByViews() {
    const data = await this.productService.getProductByViews();
    const response = new ResponseDto(true, '상품조회가 완료되었습니다', data);

    return response;
  }

  //상품 수정(미사용)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Patch(':productId')
  async update(
    @Param('productId') productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const data = await this.productService.update(productId, updateProductDto);

    const response = new ResponseDto(true, '상품수정이 완료되었습니다', null);

    return response;
  }

  //상품 조회수 올리기 (필요할것 같아서 만들었습니당)
  @Patch('incrementView/:productId')
  async increaseView(@Param('productId') productId: number) {
    const data = await this.productService.increaseView(productId);

    const response = new ResponseDto(true, '조회수 증가', null);

    return response;
  }

  //상품 삭제(미사용)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Delete(':productId')
  async remove(@Param('productId') productId: number) {
    await this.productService.remove(productId);

    const response = new ResponseDto(true, '상품삭제가 완료되었습니다.', null);

    return response;
  }

  // 최근 본 상품 조회
  @UseGuards(JwtAuthGuard)
  @Get('recentView')
  async getRecentViews(@Req() req: any) {
    const data = await this.productService.getRecentViews(req.user.id);

    const response = new ResponseDto(
      true,
      '최근 본 상품 조회가 완료되었습니다.',
      data,
    );

    return response;
  }

  // 매장 별 상품 조회
  @UseGuards(JwtAuthGuard)
  @Get('/store/:storeId')
  async findProductAllByStore(
    @Param('storeId') storeId: number,
    @Query('page') page: number,
  ) {
    const data = await this.productService.findProductAllByStore(storeId, page);

    const response = new ResponseDto(true, '검색이 완료되었습니다', data);
    return response;
  }

  // 매장 별 상품 조회 검색
  @UseGuards(JwtAuthGuard)
  @Get('/store/:storeId/:category/:keyword')
  async searchProductAllByStore(
    @Param('storeId') storeId: number,
    @Param('category') category: string,
    @Param('keyword') keyword: string,
    @Query('page') page: number,
  ) {
    const data = await this.productService.searchProductAllByStore(
      storeId,
      category,
      keyword,
      page,
    );

    const response = new ResponseDto(true, '검색이 완료되었습니다', data);
    return response;
  }
}

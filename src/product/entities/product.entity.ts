import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

// entity
import { Store } from 'src/store/entities/store.entity';
import { Wish } from 'src/wish/entities/wish.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { ProductThumbnail } from 'src/product/entities/product-thumbnail.entity';
import { ProductContent } from 'src/product/entities/product-content.entity';
import { Question } from 'src/question/entities/question.entity';

@Entity({
  name: 'products',
})
export class Product {
  // 기본키
  @PrimaryGeneratedColumn()
  id: number;

  // 원본코드
  @IsNotEmpty({ message: '코드를 입력하세요' })
  @IsNumber({}, { message: '숫자를 입력해주세요' })
  @Column({ type: 'int', nullable: false })
  code: number;

  // 상품명
  @IsNotEmpty({ message: '상품명을 입력하세요' })
  @IsString({ message: '문자형으로 입력해주세요' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  // 상품 설명
  @IsNotEmpty({ message: '상품설명을 입력하세요' })
  @IsString({ message: '문자형으로 입력해주세요' })
  @Column({ type: 'varchar', nullable: false })
  description: string;

  // 지역
  @IsNotEmpty({ message: '지역을 입력하세요' })
  @IsString({ message: '문자형으로 입력해주세요' })
  @Column({ type: 'varchar', nullable: false })
  location: string;

  // 카테고리
  @IsNotEmpty({ message: '카테고리를 정하세요' })
  @IsString({ message: '문자형으로 입력해주세요' })
  @Column({ type: 'char', nullable: false })
  category: string;

  // 포인트
  @IsNotEmpty({ message: '포인트를 입력하세요' })
  @IsNumber({}, { message: '숫자를 입력해주세요' })
  @Column({ type: 'int' })
  point: number;

  // 가격
  @IsNotEmpty({ message: '가격을 입력하세요' })
  @IsString({ message: '문자형으로 입력해주세요' })
  @Column({ type: 'int' })
  price: string;

  // 조회수
  @Column({ type: 'int', nullable: true })
  views?: string;

  @IsNotEmpty({ message: '썸네일 이미지를 넣으세요' })
  @IsString({ message: '문자형으로 입력해주세요' })
  @Column({ type: 'varchar' })
  thumbnail_image: string;

  // 다대일 관계 설정(stores)
  @ManyToOne(() => Store, (store) => store.product)
  @JoinColumn({ name: 'store_id' }) // 외래키
  store: Store; // 관계 테이블
  @Column({ type: 'int', nullable: false })
  store_id: number;

  // 일대다 관계 설정(carts)
  @OneToMany(() => Cart, (cart) => cart.product)
  cart: Cart[];

  // 일대다 관계 설정(carts)
  @OneToMany(() => Wish, (wish) => wish.product)
  wish: Wish[];

  // 일대다 관계 설정(product_thumbnail)
  @OneToMany(
    () => ProductThumbnail,
    (productThumbnail) => productThumbnail.product,
    { cascade: true },
  )
  productThumbnail: ProductThumbnail[];

  // 일대다 관계 설정(product_content)
  @OneToMany(() => ProductContent, (productContent) => productContent.product, {
    cascade: true,
  })
  productContent: ProductContent[];

  // 일대다 관계 설정(question)
  @OneToMany(() => Question, (question) => question.product)
  question: Question[];
}

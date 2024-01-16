import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entity
import { Store } from 'src/store/entities/store.entity';
import { Wish } from 'src/wish/entities/wish.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { ProductThumbnail } from 'src/product-thumbnail/entities/product-thumbnail.entity';
import { ProductContent } from 'src/product-content/entities/product-content.entity';

@Entity({
  name: 'products',
})
export class Product {
  // 기본키
  @PrimaryGeneratedColumn()
  id: number;

  // 원본코드
  @Column({ type: 'int', select: false, nullable: false })
  code: string;

  // 상품명
  @Column({ type: 'varchar', select: false, nullable: false })
  name: string;

  // 상품 설명
  @Column({ type: 'varchar', nullable: false })
  description: string;

  // 지역
  @Column({ type: 'varchar', nullable: false })
  location: string;

  // 카테고리
  @Column({ type: 'char', nullable: false })
  category: string;

  // 포인트
  @Column({ type: 'int' })
  point: string;

  // 가격
  @Column({ type: 'int' })
  price: string;

  // 조회수
  @Column({ type: 'int' })
  views: string;

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
  )
  productThumbnail: ProductThumbnail[];

  // 일대다 관계 설정(product_content)
  @OneToMany(() => ProductContent, (productContent) => productContent.product)
  productContent: ProductContent[];
}

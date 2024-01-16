import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entity
import { Product } from 'src/product/entities/product.entity';

@Entity({
  name: 'product_contents',
})
export class ProductContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  content: string;

  // 다대일 관계 설정(products)
  @ManyToOne(() => Product, (product) => product.productContent)
  @JoinColumn({ name: 'store_id' }) // 외래키
  product: Product; // 관계 테이블
  @Column({ type: 'int', nullable: false })
  store_id: number;
}

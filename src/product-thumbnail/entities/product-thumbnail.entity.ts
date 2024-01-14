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
  name: 'product_thumbnails',
})
export class ProductThumbnail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  image_url: string;

  // 다대일 관계 설정(products)
  @ManyToOne(() => Product, (product) => product.productThumbnail)
  @JoinColumn({ name: 'product_id' }) // 외래키
  product: Product; // 관계 테이블
}

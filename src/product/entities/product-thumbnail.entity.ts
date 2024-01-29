import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entity
import { Product } from 'src/product/entities/product.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({
  name: 'product_thumbnails',
})
export class ProductThumbnail {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ message: '이미지를 넣어주세요' })
  @IsString({ message: '문자형으로 입력해주세요' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  image_url: string;

  // 다대일 관계 설정(products)
  @ManyToOne((type) => Product, (product) => product.productThumbnail, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' }) // 외래키
  product: Product; // 관계 테이블
  @Column({ type: 'int', nullable: false })
  product_id: number;
}

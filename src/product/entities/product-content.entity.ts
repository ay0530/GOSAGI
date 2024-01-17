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
  name: 'product_contents',
})
export class ProductContent {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({message: '내용을 넣으세요'})
  @IsString({message: '문자형으로 입력해주세요'})
  @Column({ type: 'varchar', unique: true, nullable: false })
  content: string;

  // 다대일 관계 설정(products)
  @ManyToOne(() => Product, (product) => product.productContent, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'product_id' }) // 외래키
  product: Product; // 관계 테이블
  @Column()
  productId: number;
}

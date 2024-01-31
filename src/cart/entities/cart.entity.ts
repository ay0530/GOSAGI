import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entity
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity({
  name: 'carts',
})
export class Cart {
  // 기본키
  @PrimaryGeneratedColumn()
  id: number;

  // 수량
  @Column({ type: 'int', nullable: false })
  quantity: number;

  // 다대일 관계 설정(users)
  @ManyToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: 'user_id' }) // 외래키
  user: User; // 관계 테이블
  @Column({ type: 'int', nullable: false })
  user_id: number;

  // 다대일 관계 설정(products)
  @ManyToOne(() => Product, (product) => product.cart)
  @JoinColumn({ name: 'product_id' }) // 외래키
  product: Product; // 관계 테이블
  @Column({ type: 'int', nullable: false })
  product_id: number;
}

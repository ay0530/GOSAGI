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
  name: 'wishs',
})
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  // 다대일 관계 설정(users)
  @ManyToOne(() => User, (user) => user.wish)
  @JoinColumn({ name: 'user_id' }) // 외래키
  user: User; // 관계 테이블

  // 다대일 관계 설정(users)
  @ManyToOne(() => Product, (product) => product.wish)
  @JoinColumn({ name: 'product_id' }) // 외래키
  product: Product; // 관계 테이블
}

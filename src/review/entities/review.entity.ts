import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entity
import { Cart } from 'src/cart/entities/cart.entity';

@Entity({
  name: 'reviews',
})
export class Review {
  // 기본키
  @PrimaryGeneratedColumn()
  id: number;

  // 내용
  @Column({ type: 'varchar', nullable: false })
  content: string;

  // 작성일
  @Column({ type: 'int' })
  rate: number;

  // 일대일 관계 설정(answer)
  @OneToOne(() => Cart)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart[];
}

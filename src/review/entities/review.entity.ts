import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// entity
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';

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

  // 작성일
  @CreateDateColumn()
  created_at: Date;

  // 수정일
  @UpdateDateColumn()
  updated_at: Date;

  // 일대일 관계 설정(order)
  @OneToOne(() => Order, (order) => order.review)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'int', nullable: false })
  order_id: number;

  // 다대일 관계 설정(users)
  @ManyToOne(() => User, (user) => user.review)
  @JoinColumn({ name: 'user_id' }) // 외래키
  user: User; // 관계 테이블

  @Column({ type: 'int', nullable: false })
  user_id: number;
}

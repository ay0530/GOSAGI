import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Role
import { UserRole, UserRoleType } from 'src/user/types/userRole.type';
import { Store } from 'src/store/entities/store.entity';
import { Wish } from 'src/wish/entities/wish.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import { Question } from 'src/question/entities/question.entity';
import { Review } from 'src/review/entities/review.entity';
import { Address } from 'src/address/entities/address.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', unique: false, nullable: false })
  nickname: string;

  @Column({ type: 'int', default: UserRole.USER })
  role: UserRoleType;

  @Column({ type: 'int', nullable: true })
  point?: string;

  // 일대다 관계 설정(stores)
  @OneToMany(() => Store, (store) => store.user)
  store: Store[];

  // 일대다 관계 설정(wishs)
  @OneToMany(() => Wish, (wish) => wish.user)
  wish: Wish[];

  // 일대다 관계 설정(carts)
  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];

  // 일대다 관계 설정(orders)
  @OneToMany(() => Cart, (order) => order.user)
  order: Order[];

  // 일대다 관계 설정(orders)
  @OneToMany(() => Review, (review) => review.user)
  review: Review[];

  // 일대다 관계 설정(questions)
  @OneToMany(() => Question, (question) => question.user)
  question: Question[];

  // 일대다 관계 설정(addresses)
  @OneToMany(() => Address, (address) => address.user)
  address: Address[];
}

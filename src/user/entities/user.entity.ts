import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Role
import { UserRole } from '../types/userRole.type';
import { Store } from 'src/store/entities/store.entity';
import { Wish } from 'src/wish/entities/wish.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Question } from 'src/question/entities/question.entity';

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

  @Column({ type: 'varchar', unique: true, nullable: false })
  nickname: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

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

  // 일대다 관계 설정(questions)
  @OneToMany(() => Question, (question) => question.user)
  question: Question[];
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entity
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity({
  name: 'stores',
})
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  // 상호명
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  // 연락처
  @Column({ type: 'varchar', select: false, nullable: false })
  phone_number: string;

  // 사업자 번호
  @Column({ type: 'varchar', unique: true, nullable: false })
  business_number: string;

  // 사업자 주소
  @Column({ type: 'int' })
  address: string;

  // 다대일 관계 설정(users)
  @ManyToOne(() => User, (user) => user.store)
  @JoinColumn({ name: 'user_id' }) // 외래키
  user: User; // 관계 테이블

  // 일대다 관계 설정(products)
  @OneToMany(() => Product, (product) => product.store)
  product: Product[];
}

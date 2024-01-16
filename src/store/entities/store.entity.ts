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
  // 기본키
  @PrimaryGeneratedColumn()
  id: number;

  // 상호명
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  // 연락처
  @Column({ type: 'varchar', nullable: false })
  phone_number: string;

  // 사업자 번호
  @Column({ type: 'varchar', unique: true, nullable: false })
  business_number: string;

  // 사업자 주소
  @Column({ type: 'varchar' })
  address: string;

  // 다대일 관계 설정(users)
  @ManyToOne(() => User, (user) => user.store)
  @JoinColumn({ name: 'user_id' }) // 외래키
  user: User; // 관계 테이블
  @Column({ type: 'int', nullable: false })
  user_id: number;

  // 일대다 관계 설정(products)
  @OneToMany(() => Product, (product) => product.store)
  product: Product[];
}

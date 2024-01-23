import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from 'src/user/entities/user.entity';

@Entity({
  name: 'addresses',
})
export class Address {
  // 기본키
  @PrimaryGeneratedColumn()
  id: number;

  // 배송지명
  @Column({ type: 'varchar' })
  address_name: string;

  // 수령인
  @Column({ type: 'varchar', nullable: false })
  name: string;

  // 전화번호
  @Column({ type: 'varchar' })
  phone: number;

  // 주소
  @Column({ type: 'varchar', nullable: false })
  address: string;

  // 상세주소
  @Column({ type: 'varchar', nullable: false })
  detail_address: string;

  // 우편번호
  @Column({ type: 'varchar', nullable: false })
  post_code: number;

  // 다대일 관계 설정(users)
  @ManyToOne(() => User, (user) => user.address)
  @JoinColumn({ name: 'user_id' }) // 왜래키
  user: User; // 관계 테이블
  @Column()
  user_id: number;
}

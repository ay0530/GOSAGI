import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entity
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Review } from 'src/review/entities/review.entity';

@Entity({
  name: 'orders',
})
export class Order {
  // 기본키
  @PrimaryGeneratedColumn()
  id: number;

  // 수량
  @Column({ type: 'int', nullable: false })
  quantity: number;

  //상태 : 구매 완료, 배송 중, 배송 완료, 구매 확정, 환불 신청, 환불 완료
  //추후 enum으로 교체
  @Column({ type: 'varchar', nullable: false })
  status: string;

  @Column({ type: 'varchar', nullable: false })
  product_name: string;

  //현재의 제품 한 개당 가격
  @Column({ type: 'int', nullable: false })
  product_price: number;

  //받는 사람
  @Column({ type: 'varchar', nullable: false })
  receiver: string;

  //받는 사람 전화번호
  @Column({ type: 'varchar', nullable: false })
  receiver_phone_number: string;

  //배송지명
  @Column({ type: 'varchar', nullable: true })
  delivery_name: string;

  //배송지 주소
  @Column({ type: 'varchar', nullable: false })
  delivery_address: string;

  //우편 번호
  @Column({ type: 'varchar', nullable: false })
  post_code: string;

  //고객의 요청사항
  @Column({ type: 'varchar', nullable: true })
  delivery_request: string;

  //특수 상황 : 교환신청, 반품신청 (enum or string)
  @Column({ type: 'varchar', nullable: true })
  after_service_request: string;

  //주문한 시간을 저장
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  //배송을 보낸 시간을 저장하는 컬럼
  @Column({ type: 'timestamp', nullable: true })
  deliveryAt: Date;

  // 다대일 관계 설정(users)
  @ManyToOne(() => User, (user) => user.order)
  @JoinColumn({ name: 'user_id' }) // 외래키
  user: User; // 관계 테이블
  @Column({ type: 'int', nullable: false })
  user_id: number;

  // 다대일 관계 설정(products)
  @ManyToOne(() => Product, (product) => product.order)
  @JoinColumn({ name: 'product_id' }) // 외래키
  product: Product; // 관계 테이블
  @Column({ type: 'int', nullable: false })
  product_id: number;

  @OneToOne(() => Review, (review) => review.order)
  review: Review;
}

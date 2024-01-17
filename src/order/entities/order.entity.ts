import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  // entity
  import { User } from 'src/user/entities/user.entity';
  import { Product } from 'src/product/entities/product.entity';
  
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
  
    // 다대일 관계 설정(users)
    @ManyToOne(() => User, (user) => user.order)
    @JoinColumn({ name: 'user_id' }) // 외래키
    user: User; // 관계 테이블
    @Column({ type: 'int', nullable: false })
    user_id: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    // 다대일 관계 설정(products)
    @ManyToOne(() => Product, (product) => product.order)
    @JoinColumn({ name: 'product_id' }) // 외래키
    product: Product; // 관계 테이블
    @Column({ type: 'int', nullable: false })
    product_id: number;
  }
  
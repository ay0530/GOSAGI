import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { QuestionStatus } from 'src/question/types/questionStatus.type';
import { QuestionStatusType } from 'src/question/types/questionStatus.type';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity({
  name: 'questions',
})
export class Question {
  // 기본키
  @PrimaryGeneratedColumn()
  id: number;

  // 제목
  @Column({ type: 'varchar', nullable: false })
  title: string;

  // 내용
  @Column({ type: 'varchar', nullable: false })
  content: string;

  // 상태
  @Column({ type: 'int', default: QuestionStatus.ACTIVATE })
  status: QuestionStatusType;

  // 작성일
  @CreateDateColumn()
  created_at: Date;

  // 수정일
  @UpdateDateColumn()
  updated_at: Date;

  // 다대일 관계 설정(user)
  @ManyToOne(() => User, (user) => user.question)
  @JoinColumn({ name: 'user_id' }) // 외래키
  user: User; // 관계 테이블
  @Column({ type: 'int', nullable: false })
  user_id: number;

  // 다대일 관계 설정(product)
  @ManyToOne(() => Product, (product) => product.question)
  @JoinColumn({ name: 'product_id' }) // 외래키
  product: Product; // 관계 테이블
  @Column({ type: 'int', nullable: false })
  product_id: number;
}

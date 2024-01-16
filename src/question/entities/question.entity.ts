import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// entity
import { User } from 'src/user/entities/user.entity';

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
}

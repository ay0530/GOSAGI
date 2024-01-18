import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// entity
import { Question } from 'src/question/entities/question.entity';

@Entity({
  name: 'answers',
})
export class Answer {
  // 기본키
  @PrimaryGeneratedColumn()
  id: number;

  // 내용
  @Column({ type: 'varchar', nullable: false })
  content: string;

  // 작성일
  @CreateDateColumn()
  created_at: Date;

  // 일대일 관계 설정(answer)
  @OneToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question[];
  @Column({ type: 'int', nullable: false })
  question_id: number;
}

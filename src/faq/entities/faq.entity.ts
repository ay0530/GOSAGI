import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'faq',
})
export class Faq {
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
  update_at: Date;
}

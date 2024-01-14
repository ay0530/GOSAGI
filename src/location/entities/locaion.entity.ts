import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'locations',
})
export class Location {
  // 기본키
  @PrimaryGeneratedColumn()
  id: number;

  // 광역시도
  @Column({ type: 'varchar' })
  ctp: string;

  // 시군구
  @Column({ type: 'varchar' })
  sig: string;

  // 읍면동
  @Column({ type: 'varchar' })
  emd: string;
}

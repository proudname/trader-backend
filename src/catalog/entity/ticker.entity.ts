import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TickerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  code: string;

  @Column()
  companyName: string;

  @Column()
  companyDescription: string;
}
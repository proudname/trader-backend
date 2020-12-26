import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ITickerEntity } from '../../types';

@Entity()
export class TickerEntity implements ITickerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  code: string;

  @Column()
  companyName: string;

  @Column()
  companyDescription: string;
}
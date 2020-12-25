import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { TickerEntity } from '../../catalog/entity/ticker.entity';

@Entity()
export class StrategyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  maxAmount: number;

  @OneToOne(() => TickerEntity)
  @JoinColumn()
  ticker: TickerEntity;

  @Column({ default: true })
  isActive: boolean;
}
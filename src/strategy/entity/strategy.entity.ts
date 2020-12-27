import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TickerEntity } from '../../catalog/entity/ticker.entity';
import { IStrategyEntity } from '../../types';
import { BaseEntity } from '../../core/objects/BaseEntity';

@Entity()
export class StrategyEntity extends BaseEntity implements IStrategyEntity {
  @Column()
  name: string;

  @Column()
  maxAmount: number;

  @Column()
  targetPrice: number;

  @OneToMany(() => TickerEntity, ticker => ticker.id)
  tickers: number[];

  @Column({ default: true })
  isActive: boolean;
}
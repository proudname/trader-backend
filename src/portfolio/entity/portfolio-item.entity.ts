import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TickerEntity } from '../../catalog/entity/ticker.entity';
import { IStrategyEntity } from '../../types';
import { BaseEntity } from '../../core/objects/BaseEntity';

@Entity()
export class StrategyEntity extends BaseEntity implements IStrategyEntity {
  @Column({unique: true})
  name: string;

  @Column()
  maxAmount: number;

  @Column()
  targetPrice: number;

  @OneToMany(() => TickerEntity, ticker => ticker.id)
  tickers: number[];

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: new Date(), type: 'timestamp' })
  cratedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;
}
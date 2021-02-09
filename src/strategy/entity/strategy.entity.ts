import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";
import { TickerEntity } from '../../catalog/entity/ticker.entity';
import { IKeyPointEntity, IStrategyEntity } from "../../types";
import { BaseEntity } from '@rasp/core';
import { KeyPointEntity } from "./key-point.entity";

@Entity()
export class StrategyEntity extends BaseEntity implements IStrategyEntity {
  @Column({ unique: true })
  name: string;

  @Column({type: 'decimal', precision: 10, scale: 2})
  maxAmount: number;

  @Column({type: 'decimal', precision: 10, scale: 2})
  targetPrice: number;

  @ManyToOne(() => TickerEntity)
  @JoinColumn({ name: 'ticker_id' })
  ticker: number|TickerEntity;

  @RelationId((strategy: StrategyEntity) => strategy.ticker)
  tickerId: number;

  @OneToMany(() => KeyPointEntity, keyPoint => keyPoint.strategy)
  @JoinColumn()
  keyPoints: IKeyPointEntity[];

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  cratedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;
}

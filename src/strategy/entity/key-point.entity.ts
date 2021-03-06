import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IKeyPointEntity } from '../../types';
import { BaseEntity } from '@rasp/core';
import { StrategyEntity } from './strategy.entity';
import { KeyPointStatus, KeyPointType } from '../../enums';

@Entity()
export class KeyPointEntity extends BaseEntity implements IKeyPointEntity {

  @Column({type: 'decimal'})
  prc: number;

  @Column()
  qty: number;

  @Column({default: KeyPointStatus.ACTIVE, enum: KeyPointStatus})
  status: KeyPointStatus;

  @Column({type: 'timestamp', nullable: true})
  executedAt?: Date;

  @ManyToOne(() => StrategyEntity, strategy => strategy.keyPoints)
  @JoinColumn({ name: 'strategy_id' })
  strategy: number|StrategyEntity;

  @Column({enum: KeyPointType})
  type: KeyPointType

  @Column({nullable: true})
  orderId?: string

}
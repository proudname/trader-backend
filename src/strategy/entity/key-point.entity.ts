import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IKeyPointEntity, IStrategyEntity } from '../../types';
import { BaseEntity } from '../../core/objects/BaseEntity';
import { StrategyEntity } from './strategy.entity';
import { KeyPointType } from '../../enums';

@Entity()
export class KeyPointEntity extends BaseEntity implements IKeyPointEntity {

  @Column()
  prc: number;

  @Column()
  status: number;

  @Column({type: 'timestamp'})
  executedAt?: Date;

  @ManyToOne(() => StrategyEntity, strategy => strategy.id)
  @JoinColumn({ name: 'strategy_id' })
  strategy: number|StrategyEntity;

  @Column({enum: KeyPointType})
  type: KeyPointType

}
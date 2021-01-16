import { Entity, Column, OneToOne } from 'typeorm';
import { TickerEntity } from '../../catalog/entity/ticker.entity';
import { IPortfolioItemEntity, ITickerEntity } from '../../types';
import { BaseEntity } from '@rasp/core';

@Entity()
export class PortfolioItemEntity extends BaseEntity implements IPortfolioItemEntity {

  @Column({unique: true})
  name: string;

  @OneToOne(() => TickerEntity)
  ticker: number|ITickerEntity;

  @Column({ default: new Date(), type: 'timestamp' })
  cratedAt: Date;
}
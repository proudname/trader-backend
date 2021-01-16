import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { IStrategyEntity, ITradeHistory } from '../../types';
import { BaseEntity } from '@rasp/core';
import { HistoryAction } from '../../enums';
import { StrategyEntity } from "../../strategy/entity/strategy.entity";

@Entity({
  name: 'trade_history'
})
export class TradeHistoryEntity extends BaseEntity implements ITradeHistory {

  @ManyToOne(type => StrategyEntity)
  strategy: IStrategyEntity;

  @RelationId((historyEntity: TradeHistoryEntity) => historyEntity.strategy)
  strategyId: number;

  @Column()
  price: number;

  @Column({ enum: HistoryAction })
  actionType: HistoryAction;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  actionDate: Date;

}
import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { TradeHistoryService } from '../services/trade-history.service';
import { TradeHistoryEntity } from '../entity/trade-history.entity';



@Crud({
  model: {
    type: TradeHistoryEntity
  },
  query: {
    alwaysPaginate: true,
    maxLimit: 100,
    join: {
      strategy: {
        eager: true
      },
      "strategy.ticker": {
        eager: true
      }
    }
  }
})
@Controller('api/trade_history')
export class TradeHistoryController implements CrudController<TradeHistoryEntity> {
  constructor(public service: TradeHistoryService) {}
}

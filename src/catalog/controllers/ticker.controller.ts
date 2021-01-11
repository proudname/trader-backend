import { Controller } from '@nestjs/common';
import { Crud, CrudController } from "@nestjsx/crud";
import { TickerEntity } from '../entity/ticker.entity';
import { TickerService } from '../services/ticker.service';


@Crud({
  model: {
    type: TickerEntity,
  },
})
@Controller('api/catalog/tickers')
export class TickerController implements CrudController<TickerEntity> {
  constructor(public service: TickerService) {}
}

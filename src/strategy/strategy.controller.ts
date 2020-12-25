import { Controller } from '@nestjs/common';
import { Crud, CrudController } from "@nestjsx/crud";
import { StrategyEntity } from './entity/strategy.entity';
import { StrategyService } from './strategy.service';


@Crud({
  model: {
    type: StrategyEntity,
  },
})
@Controller(['api', 'strategy'])
export class StrategyController implements CrudController<StrategyEntity> {
  constructor(public service: StrategyService) {}
}

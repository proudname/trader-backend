import { Body, Controller, Post } from '@nestjs/common';
import { Crud, CrudController } from "@nestjsx/crud";
import { StrategyEntity } from '../entity/strategy.entity';
import { StrategyService } from '../services/strategy.service';
import { CreateStrategyDto } from '../dto/create-strategy.dto';


@Crud({
  model: {
    type: StrategyEntity,
  },
})
@Controller('api/strategy')
export class StrategyController implements CrudController<StrategyEntity> {
  constructor(public service: StrategyService) {}


  @Post('save_new')
  async saveNew(@Body() createStrategyDto: CreateStrategyDto) {
    return this.service.createStrategy(createStrategyDto);
  }

}

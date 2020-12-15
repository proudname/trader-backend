import { Controller, Get, Post } from '@nestjs/common';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
  constructor(private tradeService: TradeService) {

  }

  @Get('portfolio')
  portfolio() {
    return this.tradeService.portfolio()
  }

  @Post('portfolio')
  buy() {
    return this.tradeService.buy({})
  }

}

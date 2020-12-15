import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TinkoffPlatform } from './platforms/tinkoff.platform';
import { TradeController } from './trade.controller';

@Module({
  providers: [TradeService, TinkoffPlatform],
  controllers: [TradeController]
})
export class TradeModule {}

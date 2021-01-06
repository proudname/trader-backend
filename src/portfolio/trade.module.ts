import { CacheModule, Inject, Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TinkoffPlatform } from './platforms/tinkoff.platform';
import { TradeController } from './trade.controller';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PortfolioProcessor } from './portfolio.processor';
import * as redisStore from 'cache-manager-redis-store';
import { StrategyModule } from '../strategy/strategy.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'portfolio',
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379
    }),
    StrategyModule
  ],
  providers: [TradeService, TinkoffPlatform, PortfolioProcessor],
  controllers: [TradeController]
})
export class TradeModule {
  constructor(@InjectQueue('portfolio') private portfolioProcessor: Queue, private tradeService: TradeService) {
    // this.portfolioProcessor.empty();
  }

  startTickerLoad() {
    this.portfolioProcessor.add('load', {}, {
      repeat: {
        cron: '0 0 */3 * *'
      }
    }).catch(console.error)
  }
}

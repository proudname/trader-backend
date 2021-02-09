import { CacheModule, Inject, Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TinkoffPlatform } from './platforms/tinkoff.platform';
import { TradeController } from './trade.controller';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PortfolioProcessor } from './portfolio.processor';
import * as redisStore from 'cache-manager-redis-store';
import { StrategyModule } from '../strategy/strategy.module';
import { TradeHistoryController } from "./controllers/trade-history.controller";
import { TradeHistoryService } from "./services/trade-history.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TradeHistoryEntity } from "./entity/trade-history.entity";

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'portfolio',
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }),
    StrategyModule,
    TypeOrmModule.forFeature([TradeHistoryEntity])
  ],
  providers: [TradeService, TinkoffPlatform, PortfolioProcessor, TradeHistoryService],
  controllers: [TradeController, TradeHistoryController]
})
export class TradeModule {}

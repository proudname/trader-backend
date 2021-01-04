import { Module } from '@nestjs/common';
import { StrategyController } from './controllers/strategy.controller';
import { StrategyService } from './services/strategy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategyEntity } from './entity/strategy.entity';
import { StrategyProcessor } from './strategy.processor';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { KeyPointEntity } from './entity/key-point.entity';
import { TinkoffPlatform } from '../portfolio/platforms/tinkoff.platform';
import { KeyPointsService } from './services/key-points.service';
import { KeyPointsController } from './controllers/key-points.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([StrategyEntity, KeyPointEntity]),
    BullModule.registerQueue({
      name: 'strategy'
    })
  ],
  controllers: [StrategyController, KeyPointsController],
  providers: [StrategyService, StrategyProcessor, TinkoffPlatform, StrategyProcessor, KeyPointsService],
  exports: [StrategyService, TypeOrmModule]
})
export class StrategyModule {
  constructor(@InjectQueue('strategy') private strategyProcessor: Queue) {
    this.strategyProcessor.empty();
  }

  startStrategyMonitor() {
    this.strategyProcessor.add('monitor', {}, {
      repeat: {
        cron: '0 */4 * * *'
      }
    }).catch(console.error)
  }
}

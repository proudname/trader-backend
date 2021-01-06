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
import { KeyPointProcessor } from './key-point.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([StrategyEntity, KeyPointEntity]),
    BullModule.registerQueue({
      name: 'strategy'
    }),
    BullModule.registerQueue({
      name: 'keypoints'
    }),
  ],
  controllers: [StrategyController, KeyPointsController],
  providers: [StrategyService, StrategyProcessor, TinkoffPlatform, KeyPointProcessor, KeyPointsService],
  exports: [StrategyService, TypeOrmModule]
})
export class StrategyModule {
  constructor(
    @InjectQueue('strategy') private strategyProcessor: Queue,
    @InjectQueue('keypoints') private keyPointsProcessor: Queue
  ) {
    this.startStrategyMonitor();
  }

  startStrategyMonitor() {
    this.strategyProcessor.add('monitor', {}, {
      repeat: {
        cron: '*/3 * * * *'
      }
    }).catch(console.error)
  }
}

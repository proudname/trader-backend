import { Module } from '@nestjs/common';
import { StrategyController } from './controllers/strategy.controller';
import { StrategyService } from './services/strategy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategyEntity } from './entity/strategy.entity';
import { StrategyProcessor } from './processors/strategy.processor';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { KeyPointEntity } from './entity/key-point.entity';
import { TinkoffPlatform } from '../trade/platforms/tinkoff.platform';
import { KeyPointsService } from './services/key-points.service';
import { KeyPointsController } from './controllers/key-points.controller';
import { KeyPointProcessor } from './processors/key-point.processor';

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
    @InjectQueue('keypoints') private keyPointsProcessor: Queue,
    private service: StrategyService
  ) {
    this.startStrategyMonitor();
  }

  async startStrategyMonitor() {
    await this.strategyProcessor.empty();
    await this.keyPointsProcessor.empty();
    this.strategyProcessor.add('monitor', {}, {
      repeat: {
        cron: '*/3 * * * *'
      }
    }).catch(console.error)
  }
}

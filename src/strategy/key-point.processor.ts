import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError, OnQueueFailed,
  OnQueueStalled,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { StrategyService } from './services/strategy.service';
import { ExtraLogger } from '../core/objects/ExtraLogger';
import { StrategyEntity } from './entity/strategy.entity';

@Processor('keypoints')
export class KeyPointProcessor {

  constructor(private strategyService: StrategyService) {

  }

  private readonly logger = new ExtraLogger(KeyPointProcessor.name);

  @OnQueueError()
  onError(error: Error) {
    this.logger.detailErr(`Ошибка при анализе тикеров`, error);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.detailErr('Задача failed', err);
  }


  @Process()
  async apply(job: Job<{strategy: StrategyEntity, price: number, figi: string}>) {
    const { strategy, price, figi } = job.data;
    await this.strategyService.applyActionMonitor(strategy, price, figi);
  }


}
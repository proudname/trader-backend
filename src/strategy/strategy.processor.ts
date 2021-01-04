import { OnQueueActive, OnQueueCompleted, OnQueueError, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { StrategyService } from './services/strategy.service';
import { ExtraLogger } from '../core/objects/ExtraLogger';

@Processor('strategy')
export class StrategyProcessor {


  constructor(private strategyService: StrategyService) {
  }

  private readonly logger = new ExtraLogger(StrategyProcessor.name);


  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log('Начинается загрузка тикеров');
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log('Тикеры загружены');
  }

  @OnQueueError()
  onError(error: Error) {
    this.logger.log(`Ошибка при загрузке тикеров: ${error}`);
  }

  @Process('monitor')
  async load(job: Job) {
    this.strategyService.startTracking().catch((err) => {
      this.logger.detailErr('Ошибка в трекинге', err);
    })
  }

}
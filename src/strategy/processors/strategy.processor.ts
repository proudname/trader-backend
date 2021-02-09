import { OnQueueActive, OnQueueCompleted, OnQueueError, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { StrategyService } from "../services/strategy.service";
import { ExtraLogger } from '@rasp/core';
import { TickerEntity } from '../../catalog/entity/ticker.entity';
import { StrategyEntity } from "../entity/strategy.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Processor('strategy')
export class StrategyProcessor {


  constructor(
    private strategyService: StrategyService,
    @InjectRepository(StrategyEntity) private strategyRepository: Repository<StrategyEntity>
  ) {
  }

  private static _subscribers: Map<string, () => any> = new Map();

  private readonly logger = new ExtraLogger(StrategyProcessor.name);


  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log('Начинается остлеживание данных по стратегиям');
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log('Тикеры загружены');
  }

  @OnQueueError()
  onError(error: Error) {
    this.logger.log(`Ошибка при загрузке тикеров: ${error}`);
  }

  // обновление отслеживаемых тикеров и данных стратегий
  @Process('monitor')
  async load(job: Job) {
    const strategies = await this.strategyService.loadActiveStrategies();
    for (const { ticker, ...strategy } of strategies) {
      if (ticker instanceof TickerEntity) {
        const { figi } = ticker;
        const isTickerActive = await this.strategyService._isMarketActive(ticker);
        if (!isTickerActive) {
          this.logger.detailInfo('Тикер не активен', ticker.code);
          return;
        }
        const unregisterFunc = await this.strategyService.registerCandleMonitor({ ticker, ...strategy} as StrategyEntity&{ticker: TickerEntity});
        if (StrategyProcessor._subscribers.has(figi)) {
          StrategyProcessor._subscribers.get(figi)();
        }
        StrategyProcessor._subscribers.set(figi, unregisterFunc);
        this.logger.detailInfo(`Запущено отслеживание событий тикера`, ticker.code);
      }
    }


  }

}

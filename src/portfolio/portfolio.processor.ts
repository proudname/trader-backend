import { OnQueueActive, OnQueueCompleted, OnQueueError, Process, Processor } from '@nestjs/bull';
import { CACHE_MANAGER, Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { polygonApi } from '../core/utils/api.util';
import { ITickerEntity, PolygonTickersResponse } from '../types';
import { TickerEntity } from '../catalog/entity/ticker.entity';
import { promisify } from 'util';
import { Cache } from 'cache-manager';
import { start } from 'repl';
const delay = promisify(setTimeout);

@Processor('portfolio')
export class PortfolioProcessor {

  // 3 дня
  _pageTTL = 60 * 60 * 24 * 3;

  static processing = false;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  private readonly logger = new Logger(PortfolioProcessor.name);

  async *loadPage(start: number) {
    let currentPage = start;
    while (currentPage) {
      try {
        const request = `/v2/reference/tickers?sort=ticker&perpage=100&page=${currentPage}&apiKey=${process.env.POLYGON_KEY}`;
        this.logger.log(`Новый запрос: ${request}`);
        const { data } = await polygonApi.get<PolygonTickersResponse>(request);
        if (!data || data.status !== 'OK') {
          this.logger.warn(`При выгрузке тикеров получена ошибка сервиса: ${data.status}`);
          return;
        }
        for (const ticker of data.tickers) yield ticker;
        const pages = Math.ceil(data.count / data.perPage);
        if (currentPage > pages) return;
        await this.cacheManager.set('tickers_last_page', ++currentPage, this._pageTTL)
      } catch (e) {
        this.logger.error(`При выгрузке тикеров произошла ошибка: ${e.message}`);
        return;
      }
    }

  }

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

  @Process('load')
  async load(job: Job) {

    if (PortfolioProcessor.processing) return;

    PortfolioProcessor.processing = true;

    const startPage = await this.cacheManager.get('tickers_last_page');

    for await (const ticker of this.loadPage(+startPage || 1)) {
      if (!ticker.codes || !ticker.codes.cfigi) continue;
      const tickerData: Omit<ITickerEntity, 'id'> = {
        code: ticker.ticker,
        companyName: ticker.name,
        companyDescription: '',
        figi: ticker.codes.cfigi
      }
      const model = new TickerEntity();
      const tickerEntity = Object.assign(model, tickerData);
      await delay(100);
      try {
        const exists = await TickerEntity.count({
          where: {
            code: tickerData.code
          }
        });
        if (exists) {
          this.logger.log(`Тикер уже существует: ${tickerEntity.code}`);
          continue;
        }
        await tickerEntity.save();
        this.logger.log(`Добавлен новый тикер: ${tickerEntity.code}`);
      } catch (e) {
        this.logger.error(`Ошибка при сохранении тикера: ${e.message}`);
        break;
      }
    }
    PortfolioProcessor.processing = false;
  }

}
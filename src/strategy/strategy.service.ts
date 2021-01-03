import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { StrategyEntity } from './entity/strategy.entity';
import { TickerEntity } from '../catalog/entity/ticker.entity';
import { ExtraLogger } from '../core/objects/ExtraLogger';
import { TinkoffPlatform } from '../portfolio/platforms/tinkoff.platform';
import { AnalysisHelper } from './helpers/analysis.helper';
import { KeyPointEntity } from './entity/key-point.entity';

@Injectable()
export class StrategyService extends TypeOrmCrudService<StrategyEntity> {

  private readonly logger = new ExtraLogger(AnalysisHelper.name);

  constructor(
    @InjectRepository(StrategyEntity) private strategyRepository,
    private tinkoffPlatform: TinkoffPlatform) {
      super(strategyRepository);
  }

  async startTracking() {
    const strategiesWithTickers: (StrategyEntity&{keyPoints: KeyPointEntity[]}&{ticker: TickerEntity|null})[] = await this.strategyRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.ticker', 't')
      .where('s.isActive = TRUE')
      .getMany();
    for (const {ticker, keyPoints, ...strategy} of strategiesWithTickers) {
      if (ticker instanceof TickerEntity) {
        const helper = new AnalysisHelper(strategy as StrategyEntity, ticker, keyPoints, this.tinkoffPlatform);
        await helper.startAnalysis();
        this.logger.detailInfo(`Запущено отслеживание событий тикера`, ticker.code);
      }
    }
  }

}
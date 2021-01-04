import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { StrategyEntity } from '../entity/strategy.entity';
import { TickerEntity } from '../../catalog/entity/ticker.entity';
import { ExtraLogger } from '../../core/objects/ExtraLogger';
import { TinkoffPlatform } from '../../portfolio/platforms/tinkoff.platform';
import { AnalysisHelper } from '../helpers/analysis.helper';
import { KeyPointEntity } from '../entity/key-point.entity';
import { Connection, Repository } from 'typeorm';
import { ICreateStrategyDto } from '../../types';
import { InternalException } from '../../core/exceptions/internal.exception';

@Injectable()
export class StrategyService extends TypeOrmCrudService<StrategyEntity> {

  private readonly logger = new ExtraLogger(AnalysisHelper.name);

  constructor(
    @InjectRepository(StrategyEntity) private strategyRepository: Repository<StrategyEntity>,
    @InjectRepository(KeyPointEntity) private keyPointRepository: Repository<KeyPointEntity>,
    private connection: Connection,
    private tinkoffPlatform: TinkoffPlatform) {
      super(strategyRepository);
  }

  async createStrategy(data: ICreateStrategyDto) {
      const { keyPoints, ...strategy } = data;
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const strategyEntity = new StrategyEntity();
        const filledStrategyEntity = Object.assign(strategyEntity, strategy);
        const strategyRecord = await queryRunner.manager.save<StrategyEntity>(filledStrategyEntity);
        const modifiedKeyPoints = keyPoints.filter(keyPoint => keyPoint.modified);
        for (const keyPoint of modifiedKeyPoints) {
          const keyPointEntity = new KeyPointEntity();
          const filledKeyPointEntity = Object.assign(keyPointEntity, keyPoint, { strategy: strategyRecord.id });
          await queryRunner.manager.save<KeyPointEntity>(filledKeyPointEntity);
        }
        await queryRunner.commitTransaction();
        return {
          ok: 1
        }
      } catch (err) {
        // since we have errors lets rollback the changes we made
        this.logger.detailErr('Ошибка при сохранении новой стратегии', err);
        await queryRunner.rollbackTransaction();
        throw new InternalException('Ошибка при сохранении');
      } finally {
        // you need to release a queryRunner which was manually instantiated
        await queryRunner.release();
      }
  }

  async startTracking() {
    const strategies = await this.strategyRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.ticker', 't')
      .where('s.isActive = TRUE')
      .getMany();
    for (const {ticker,  ...strategy} of strategies) {
      if (ticker instanceof TickerEntity) {
        const keyPoints = await this.keyPointRepository.find({
          where: {
            strategy: strategy.id
          }
        });
        const helper = new AnalysisHelper(strategy as StrategyEntity, ticker, keyPoints, this.tinkoffPlatform);
        await helper.startAnalysis();
        this.logger.detailInfo(`Запущено отслеживание событий тикера`, ticker.code);
      }
    }
  }

}
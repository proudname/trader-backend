import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { StrategyEntity } from '../entity/strategy.entity';
import { TickerEntity } from '../../catalog/entity/ticker.entity';
import {
  ExtraLogger,
  getSumByPercent,
  InternalException,
  setDefaults,
} from '@rasp/core';
import { TinkoffPlatform } from '../../trade/platforms/tinkoff.platform';
import { AnalysisHelper } from '../helpers/analysis.helper';
import { KeyPointEntity } from '../entity/key-point.entity';
import { Connection, Repository } from 'typeorm';
import {
  DecisionActionResult,
  DecisionResult,
  ICreateStrategyDto,
  TinkoffInstrumentInfoMessage,
} from '../../types';
import {
  DecideEnum,
  HistoryAction,
  KeyPointStatus,
  KeyPointType,
} from '../../enums';
import _ from 'lodash';
import { CandleStreaming } from '@tinkoff/invest-openapi-js-sdk';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TradeHistoryEntity } from '../../trade/entity/trade-history.entity';

@Injectable()
export class StrategyService extends TypeOrmCrudService<StrategyEntity> {

  private readonly logger = new ExtraLogger(AnalysisHelper.name);

  constructor(
    @InjectRepository(StrategyEntity) private strategyRepository: Repository<StrategyEntity>,
    @InjectRepository(KeyPointEntity) private keyPointRepository: Repository<KeyPointEntity>,
    @InjectQueue('keypoints') private keyPointsProcessor: Queue,
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
        let strategyEntity = new StrategyEntity();
        if (data.id) {
          const exist = await StrategyEntity.findOne(data.id);
          if (exist) strategyEntity = exist;
        }
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
          ok: 1,
          data: strategyRecord
        }
      } catch (err) {
        this.logger.detailErr('Ошибка при сохранении новой стратегии', err);
        await queryRunner.rollbackTransaction();
        throw new InternalException('Ошибка при сохранении');
      } finally {
        await queryRunner.release();
      }
  }

  async loadStrategyWithPoints(strategyId: number) {
    return this.strategyRepository.createQueryBuilder('s')
      .where('s.id = :id', { id: strategyId })
      .leftJoinAndSelect('s.keyPoints', 'keyPoints')
      .getOne()
  }

  // получить "решение" системы, покупать акции или нет
  async getDecision(keyPoints: KeyPointEntity[], targetPrice: number, averagePrice: number): Promise<DecisionResult> {
    const sortedKeyPoints: {[key: string]: KeyPointEntity[]} = _.groupBy(keyPoints, 'type');
    const orDefault = setDefaults([]);
    if (averagePrice > targetPrice) {
      const takeProfit = orDefault(sortedKeyPoints[KeyPointType.TAKE_PROFIT]);
      return this._getTakeProfitDecision(takeProfit, targetPrice, averagePrice); //todo: переделать красиво
    } else if (averagePrice < targetPrice) {
      const stopLoss = orDefault(sortedKeyPoints[KeyPointType.STOP_LOSS]);
      return this._getStopLossDecision(stopLoss, targetPrice, averagePrice);
    }
    return {
      action: DecideEnum.DO_NOTHING
    }
  }


  _getStopLossDecision(keyPoints: KeyPointEntity[], targetPrice: number, averagePrice: number): DecisionResult {
    const stopLossActionData = keyPoints.filter(lossPoint => {
      const sum = getSumByPercent(targetPrice, lossPoint.prc);
      return sum >= averagePrice;
    });
    if (stopLossActionData.length) {
      const sellCount = stopLossActionData.reduce((a, b) => a + b.qty, 0);
      if (sellCount > 0) {
        return {
          action: DecideEnum.BUY,
          qty: sellCount,
          keyPoints: stopLossActionData
        }
      }
    }
    return {
      action: DecideEnum.DO_NOTHING
    }
  }

  _getTakeProfitDecision(keyPoints: KeyPointEntity[], targetPrice: number, averagePrice: number): DecisionResult {
    const takeProfitActionData = keyPoints.filter(takePoint => {
      const sum = getSumByPercent(targetPrice, takePoint.prc);
      return sum <= averagePrice;
    });
    if (takeProfitActionData.length) {
      const buyCount = takeProfitActionData.reduce((a, b) => a + b.qty, 0);
      if (buyCount > 0) {
        return {
          action: DecideEnum.SELL,
          qty: buyCount,
          keyPoints: takeProfitActionData
        }
      }
    }
    return {
      action: DecideEnum.DO_NOTHING
    }
  }

  async loadActiveKeyPoints(strategyId: number) {
    return this.keyPointRepository.find({
      where: {
        strategy: strategyId,
        status: KeyPointStatus.ACTIVE
      }
    });
  }

  async loadActiveStrategies() {
    return this.strategyRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.ticker', 't')
      .where('s.isActive = TRUE')
      .getMany();
  }

  async applyStrategyAction(decision: DecisionActionResult, figi: string, price: number) {
    const { api } = this.tinkoffPlatform;
    const orderData = {
      figi,
      operation: decision.action === DecideEnum.BUY ? "Buy" : "Sell",
      lots: decision.qty,
      price: Math.floor(price * 100) / 100
    };
    return api.limitOrder(orderData as any);
  }

  async validateDecision(decision: DecisionResult, figi: string): Promise<DecisionActionResult|null> {
    if (decision.action === DecideEnum.DO_NOTHING) return;
    const { api } = this.tinkoffPlatform;
    let { qty } = decision;
    if (decision.action === DecideEnum.SELL) {
      const instrument = await api.instrumentPortfolio({ figi });
      if (!instrument) return null;
      const allowedLots = instrument.blocked ? instrument.lots - instrument.blocked : instrument.lots;
      if (allowedLots < 1) return null;
      if (allowedLots < decision.qty) {
        qty = allowedLots;
      }
    }
    return { ...decision, qty }
  }

  async applyActionMonitor(strategy: StrategyEntity, price: number, figi: string) {
    try {
      const keyPoints = await this.loadActiveKeyPoints(strategy.id);
      const decision = await this.getDecision(keyPoints, strategy.targetPrice, price);
      const validatedDecision = await this.validateDecision(decision, figi);
      if (!validatedDecision) return;
      const { orderId } = await this.applyStrategyAction(validatedDecision, figi, price);
      for (const keyPoint of validatedDecision.keyPoints) {
        keyPoint.status = KeyPointStatus.EXECUTED;
        keyPoint.executedAt = new Date();
        keyPoint.orderId = orderId;
        await keyPoint.save();
        const historyRecord = new TradeHistoryEntity();
        historyRecord.strategy = strategy;
        historyRecord.actionType = decision.action === DecideEnum.BUY ? HistoryAction.BUY : HistoryAction.SELL;
        historyRecord.price = price;
        historyRecord.save().catch((err) => this.logger.detailErr('Ошибка при сохранении записи в историю', err))
      }
    } catch (e) {
      this.logger.detailErr('Ошибка при обработке стратегии', e);
    }

  }

  async _isMarketActive({ figi }) {
    const { api } = this.tinkoffPlatform;
    return new Promise((resolve) => api.instrumentInfo({ figi }, (message: TinkoffInstrumentInfoMessage) => {
      if (message.trade_status === 'normal_trading') {
        return resolve(true);
      }
      return resolve(false)
    }))
  }


  async registerCandleMonitor(strategy: StrategyEntity & { ticker: TickerEntity }) {
    const { api } = this.tinkoffPlatform;
    const { ticker } = strategy;
    await this.tinkoffPlatform.applySettings()
    return api.candle({ figi: ticker.figi }, _.throttle(async (candle: CandleStreaming) => {
      const averagePrice = Number(_.mean([candle.h, candle.l]));
      await this.keyPointsProcessor.add({
        strategy,
        figi: ticker.figi,
        price: averagePrice
      })
    }, 5000))
  }

  async getDataByTicker(ticker: string) {
    return this.tinkoffPlatform.api.search({ ticker });
  }

}

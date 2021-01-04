import { StrategyEntity } from '../entity/strategy.entity';
import { TickerEntity } from '../../catalog/entity/ticker.entity';
import { DecisionResult, TinkoffInstrumentInfoMessage } from '../../types';
import { TinkoffPlatform } from '../../portfolio/platforms/tinkoff.platform';
import OpenAPI, { CandleStreaming } from '@tinkoff/invest-openapi-js-sdk';
import _ from 'lodash';
import { DecideEnum, KeyPointType } from '../../enums';
import { ExtraLogger } from '../../core/objects/ExtraLogger';
import { KeyPointEntity } from '../entity/key-point.entity';
import { getSumByPercent } from '../../core/utils/math.util';
import { setDefaults } from '../../core/utils/func.util';


export class AnalysisHelper {

  private readonly api: OpenAPI
  private readonly logger = new ExtraLogger(AnalysisHelper.name);
  private _stopCallback: any;


  constructor(public strategy: StrategyEntity, public ticker: TickerEntity, public keyPoints: KeyPointEntity[], public platform: TinkoffPlatform) {
    this.api = platform.api;
  }


  async _isMarketActive({ figi }) {
    return new Promise((resolve) => this.api.instrumentInfo({ figi }, (message: TinkoffInstrumentInfoMessage) => {
      if (message.trade_status === 'normal_trading') {
        return resolve(true);
      }
      return resolve(false)
    }))
  }


  async startAnalysis() {
    const { ticker } = this;
    const isTickerActive = await this._isMarketActive(ticker);
    if (!isTickerActive) return;
    const unregisterFunc = this.api.candle(ticker, (candle: CandleStreaming) => {
        const averagePrice = _.mean([candle.h, candle.l]);
        return this._worker(averagePrice);
      }
    )
    if (this._stopCallback) {
      this.stopAnalysis()
    }
    this._stopCallback = unregisterFunc;
  }



  stopAnalysis() {
    if (typeof this._stopCallback === 'function') {
      this._stopCallback();
      this._stopCallback = null;
    }
  }



  async getDecision(averagePrice: number): Promise<DecisionResult> {
    const { strategy } = this;
    const sortedKeyPoints: {[key: string]: KeyPointEntity[]} = _.groupBy(this.keyPoints, 'type');
    const orDefault = setDefaults([]);
    if (averagePrice > strategy.targetPrice) {
      const takeProfit = orDefault(sortedKeyPoints[KeyPointType.TAKE_PROFIT]);
      return this._getTakeProfitDecision(takeProfit, averagePrice);
    } else if (averagePrice < strategy.targetPrice) {
      const stopLoss = orDefault(sortedKeyPoints[KeyPointType.STOP_LOSS]);
      return this._getStopLossDecision(stopLoss, averagePrice);
    }
    return {
      action: DecideEnum.DO_NOTHING
    }
  }


  _getStopLossDecision(keyPoints: KeyPointEntity[], averagePrice: number): DecisionResult {
    const stopLossActionData = keyPoints.filter(lossPoint => {
      const sum = getSumByPercent(this.strategy.targetPrice, lossPoint.prc);
      return sum >= averagePrice;
    });
    if (stopLossActionData.length) {
      const sellCount = stopLossActionData.reduce((a, b) => a + b.qty, 0);
      if (sellCount > 0) {
        return {
          action: DecideEnum.SELL,
          qty: sellCount
        }
      }
    }
    return {
      action: DecideEnum.DO_NOTHING
    }
  }

  _getTakeProfitDecision(keyPoints: KeyPointEntity[], averagePrice: number): DecisionResult {
    const takeProfitActionData = keyPoints.filter(takePoint => {
      const sum = getSumByPercent(this.strategy.targetPrice, takePoint.prc);
      return sum <= averagePrice;
    });
    if (takeProfitActionData.length) {
      const buyCount = takeProfitActionData.reduce((a, b) => a + b.qty, 0);
      if (buyCount > 0) {
        return {
          action: DecideEnum.BUY,
          qty: buyCount
        }
      }
    }
    return {
      action: DecideEnum.DO_NOTHING
    }
  }

  async _worker(price: number) {
    const decision = await this.getDecision(price);
    if (decision.action === DecideEnum.DO_NOTHING) return;
    const { api, ticker } = this;
    const { commission, orderId } = await api.limitOrder({
      operation: decision.action === DecideEnum.BUY ? "Buy" : "Sell",
      figi: ticker.figi,
      lots: decision.qty,
      price: price,
    });
    console.log(commission); // Комиссия за сделку
    await api.cancelOrder({ orderId }); // Отменяем заявку
  }

}
import { StrategyEntity } from '../entity/strategy.entity';
import { TickerEntity } from '../../catalog/entity/ticker.entity';
import { TinkoffInstrumentInfoMessage } from '../../types';
import { TinkoffPlatform } from '../../portfolio/platforms/tinkoff.platform';
import OpenAPI, { CandleStreaming } from '@tinkoff/invest-openapi-js-sdk';
import _ from 'lodash';
import { DecideEnum, KeyPointType } from '../../enums';
import { ExtraLogger } from '../../core/objects/ExtraLogger';
import { KeyPointEntity } from '../entity/key-point.entity';


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



  async getDecision(averagePrice: number): Promise<DecideEnum> {
    const sortedKeyPoints: {[key: string]: KeyPointEntity[]} = _.groupBy(this.keyPoints, 'type');
    const stopLoss = sortedKeyPoints[KeyPointType.STOP_LOSS];
    const takeProfit = sortedKeyPoints[KeyPointType.TAKE_PROFIT];
    if (stopLoss) {
      const stopLossActionData = stopLoss.filter(lossPoint => lossPoint.prc > averagePrice)
    }
    // оценка акции
    return DecideEnum.BUY;
  }


  async _worker(price: number) {
    const decision = await this.getDecision(price)
  }

}
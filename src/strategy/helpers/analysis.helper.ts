import { StrategyEntity } from '../entity/strategy.entity';
import { TickerEntity } from '../../catalog/entity/ticker.entity';
import { TinkoffPlatform } from '../../trade/platforms/tinkoff.platform';
import OpenAPI from '@tinkoff/invest-openapi-js-sdk';
import { ExtraLogger } from '@rasp/core';


export class AnalysisHelper {

  private readonly api: OpenAPI
  private readonly logger = new ExtraLogger(AnalysisHelper.name);
  private _stopCallback: any;


  constructor(
    public strategy: StrategyEntity,
    public ticker: TickerEntity,
    public platform: TinkoffPlatform
  ) {
    this.api = platform.api;
  }





  stopAnalysis() {
    if (typeof this._stopCallback === 'function') {
      this._stopCallback();
      this._stopCallback = null;
    }
  }







}

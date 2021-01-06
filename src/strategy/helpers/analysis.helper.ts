import { StrategyEntity } from '../entity/strategy.entity';
import { TickerEntity } from '../../catalog/entity/ticker.entity';
import { DecisionResult, TinkoffInstrumentInfoMessage } from '../../types';
import { TinkoffPlatform } from '../../portfolio/platforms/tinkoff.platform';
import OpenAPI, { CandleStreaming } from '@tinkoff/invest-openapi-js-sdk';
import _ from 'lodash';
import { DecideEnum, KeyPointStatus, KeyPointType } from '../../enums';
import { ExtraLogger } from '../../core/objects/ExtraLogger';
import { KeyPointEntity } from '../entity/key-point.entity';
import { getSumByPercent } from '../../core/utils/math.util';
import { setDefaults } from '../../core/utils/func.util';


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
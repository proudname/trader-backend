import { TickerEntity } from './catalog/entity/ticker.entity';
import { StrategyEntity } from './strategy/entity/strategy.entity';
import { DecideEnum, KeyPointStatus, KeyPointType } from './enums';


export interface IBaseEntity {
  id: number
}

export interface ITickerEntity extends IBaseEntity {
  code: string;
  companyName: string;
  figi: string;
  companyDescription: string;
}

export interface IStrategyEntity extends IBaseEntity {
  name: string;
  maxAmount: number;
  targetPrice: number;
  ticker: number|TickerEntity;
  isActive: boolean;
  cratedAt: Date;
  startedAt?: Date;
}

export interface IKeyPointEntity extends IBaseEntity {
  prc: number;
  status: KeyPointStatus;
  executedAt?: Date;
  strategy: number|StrategyEntity;
  type: KeyPointType;
}

export interface IPortfolioItemEntity extends IBaseEntity {
  name: string;
  ticker: number|ITickerEntity;
  cratedAt: Date;
}

export type PolygonTicker = {
  "ticker": "AAPL",
  "name": "Apple Inc.",
  "market": "STOCKS",
  "locale": "US",
  "currency": "USD",
  "active": true,
  "primaryExch": "NGS",
  "type": "cs",
  "codes"?: {
    "cik": "0000320193",
    "figiuid": "EQ0010169500001000",
    "scfigi": "BBG001S5N8V8",
    "cfigi": "BBG000B9XRY4",
    "figi": "BBG000B9Y5X2"
  },
  "attrs"?: {
    "currencyName": "Australian dollar,",
    "currency": "AUD,",
    "baseName": "United Arab Emirates dirham,",
    "base": "AED"
  },
  "updated": "2019-01-15T00:00:00.000Z",
  "url": "https://api.polygon.io/v2/reference/tickers/AAPL"
}


export type PolygonTickersResponse = {
  "page": number,
  "perPage": number,
  "count": number,
  "status": "OK"|"ERROR",
  "tickers": PolygonTicker[]
}

export type TinkoffInstrumentInfoMessage = {
  figi: 'BBG000B9XRY4',
  trade_status: 'not_available_for_trading'|'normal_trading',
  min_price_increment: 0.01,
  lot: 1,
  limit_up: 135.46,
  limit_down: 130.1
}

export type DecisionNothingResult = {
  action: DecideEnum.DO_NOTHING
}

export type DecisionResult = {
  action: DecideEnum,
  qty: number
}|DecisionNothingResult


import { DecideEnum, KeyPointStatus, KeyPointType } from './enums';
import { KeyPointEntity } from './strategy/entity/key-point.entity';


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
  ticker: number|ITickerEntity;
  isActive: boolean;
  cratedAt: Date;
  startedAt?: Date;
}

export interface IKeyPointEntity extends IBaseEntity {
  prc: number;
  status: KeyPointStatus;
  executedAt?: Date;
  strategy: number|IStrategyEntity;
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

export type DecisionActionResult = {
  action: DecideEnum,
  qty: number,
  keyPoints: KeyPointEntity[]
}

export type DecisionResult = DecisionActionResult|DecisionNothingResult

export interface ICreateStrategyKeyPoint {
  id?: number;
  prc: number;
  qty: number;
  status: KeyPointStatus;
  type: KeyPointType
  modified?: boolean
}

export interface ICreateStrategyDto {
  id?: number;
  name: string;
  maxAmount: number;
  targetPrice: number;
  ticker: number;
  isActive: boolean;
  keyPoints: ICreateStrategyKeyPoint[]
}




export interface IBaseEntity {
  id: number
}

export interface ITickerEntity {
  code: string;
  companyName: string;
  companyDescription: string;
}

export interface IStrategyEntity {
  name: string;
  maxAmount: number;
  targetPrice: number;
  tickers: number[];
  isActive: boolean;
}


export interface IBaseEntity {
  id: number
}

export interface ITickerEntity extends IBaseEntity {
  code: string;
  companyName: string;
  companyDescription: string;
}

export interface IStrategyEntity extends IBaseEntity {
  name: string;
  maxAmount: number;
  targetPrice: number;
  tickers: number[];
  isActive: boolean;
  cratedAt: Date;
  startedAt?: Date;
}

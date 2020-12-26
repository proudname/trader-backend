

export interface IBaseEntity {
  id: number
}

export interface ITickerEntity extends IBaseEntity {

  code: string;

  companyName: string;

  companyDescription: string;
}
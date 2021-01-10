import { Injectable } from '@nestjs/common';
import { TinkoffPlatform } from './platforms/tinkoff.platform'
import { CandleStreaming } from '@tinkoff/invest-openapi-js-sdk';
import { Repository } from 'typeorm';
import { StrategyEntity } from '../strategy/entity/strategy.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraLogger } from '@rasp/core';

@Injectable()
export class TradeService {


  constructor(
    @InjectRepository(StrategyEntity)
    private strategyRepository: Repository<StrategyEntity>,
    private tinkoffPlatform: TinkoffPlatform) {
    // this.api = tinkoffPlatform.api;
  }

  private logger = new ExtraLogger(TradeService.name);


  async portfolio() {
    const { api } = this.tinkoffPlatform;
    return api.portfolio();
  }

  async applyStrategy(candle: CandleStreaming) {
      if (candle) {}
  }




  async buy(reqBody: any) {
    // const data = await this.api.searchOne({ ticker: 'AAPL' });
    // console.log(data);
    // const { commission, orderId } = await api.limitOrder({
    //   operation: 'Buy',
    //   figi: data.figi,
    //   lots: 1,
    //   price: 100,
    // }); // Покупаем AAPL
    // console.log(commission); // Комиссия за сделку
    // await api.cancelOrder({ orderId }); // Отменяем заявку
  }

}

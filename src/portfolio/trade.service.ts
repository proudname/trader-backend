import { Injectable } from '@nestjs/common';
import { TinkoffPlatform } from './platforms/tinkoff.platform'
import OpenAPI from '@tinkoff/invest-openapi-js-sdk';

@Injectable()
export class TradeService {

  api: OpenAPI;

  constructor(private tinkoffPlatform: TinkoffPlatform) {
    this.api = tinkoffPlatform.api;
  }

  async portfolio() {
    const { api } = this.tinkoffPlatform;
    return api.portfolio();
  }


  async buy(reqBody: any) {
    const data = await this.api.searchOne({ ticker: 'AAPL' });
    console.log(data);
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

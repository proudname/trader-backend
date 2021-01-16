import { Injectable } from '@nestjs/common';
import OpenAPI from '@tinkoff/invest-openapi-js-sdk';
import { tinkoffApiUrl, tinkoffSocketUrl, tinkoffSandboxApiUrl } from '../trade.constants';

@Injectable()
export class TinkoffPlatform {


  public api: OpenAPI;

  constructor() {
    const { TIN_SANDBOX_KEY } = process.env;
    this.api = new OpenAPI({ apiURL: tinkoffSandboxApiUrl, secretToken: TIN_SANDBOX_KEY, socketURL: tinkoffSocketUrl });
  }

  async applySettings() {
    await this.api.sandboxClear(); // очищаем песочницу
    await this.api.setCurrenciesBalance({ currency: 'USD', balance: 1000 }); // 1000$ на счет
  }
}
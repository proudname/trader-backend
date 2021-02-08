import { Injectable } from '@nestjs/common';
import OpenAPI from '@tinkoff/invest-openapi-js-sdk';
import { tinkoffApiUrl, tinkoffSocketUrl, tinkoffSandboxApiUrl } from '../trade.constants';
import { isProduction } from "../../common/utils/env.utils";

@Injectable()
export class TinkoffPlatform {


  public api: OpenAPI;

  constructor() {
    const connectData: any = {
      socketURL: tinkoffSocketUrl
    }
    if (isProduction()) {
      const { TIN_KEY } = process.env;
      connectData.apiURL = tinkoffApiUrl;
      connectData.secretToken = TIN_KEY;
    } else {
      const { TIN_SANDBOX_KEY } = process.env;
      connectData.apiURL = tinkoffSandboxApiUrl;
      connectData.secretToken = TIN_SANDBOX_KEY;
    }
    this.api = new OpenAPI(connectData);
  }

  async applySettings() {
    if (!isProduction()) {
      // todo: нужно ли это тут?
      await this.api.setCurrenciesBalance({ currency: 'USD', balance: 1000000 });
      await this.api.setCurrenciesBalance({ currency: 'RUB', balance: 1000000 });
    }
  }
}

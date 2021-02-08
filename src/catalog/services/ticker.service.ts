import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { TickerEntity } from "../entity/ticker.entity";
import { ExtraLogger } from '@rasp/core';
import { PolygonQuery, PolygonTicker, PolygonTickersResponse } from '../../types';
import qs from 'querystring';
import _ from 'lodash';
import { polygonApi } from "../../common/utils/api/polygonApi";

@Injectable()
export class TickerService extends TypeOrmCrudService<TickerEntity> {
  constructor(@InjectRepository(TickerEntity) repo) {
    super(repo);
  }

  private readonly logger = new ExtraLogger(TickerService.name);


  async *loadTicker(start: number) {
    const currentPage = start;
    while (currentPage) {
      try {
        const data = await this.loadPage({
          perpage: 100,
          sort: 'ticker',
          page: currentPage
        })
        if (!data || data.status !== 'OK') {
          this.logger.warn(`При выгрузке тикеров получена ошибка сервиса: ${data.status}`);
          return;
        }
        for (const ticker of data.tickers) yield ticker;
        const pages = Math.ceil(data.count / data.perPage);
        if (currentPage > pages) return;
      } catch (e) {
        this.logger.error(`При выгрузке тикеров произошла ошибка: ${e.message}`);
        return;
      }
    }
  }

  async loadPage(query: PolygonQuery) {
    const defaultQuery: Partial<PolygonQuery> = {
      page: 1,
      apiKey: process.env.POLYGON_KEY,
      sort: 'ticker',
      perpage: 50
    }
    const queryData = _.defaultsDeep(query, defaultQuery);
    const queryString = qs.stringify(queryData);
    const { data } = await polygonApi.get<PolygonTickersResponse>(`/v2/reference/tickers?${queryString}`);
    if (!data || data.status !== 'OK') {
      this.logger.warn(`При выгрузке тикеров получена ошибка сервиса: ${data.status}`);
      return null;
    }
    return data;
  }

}
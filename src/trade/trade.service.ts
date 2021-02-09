import { Injectable } from '@nestjs/common';
import { TinkoffPlatform } from './platforms/tinkoff.platform'
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
  }

  private logger = new ExtraLogger(TradeService.name);


  async portfolio() {
    const { api } = this.tinkoffPlatform;
    return api.portfolio();
  }

}

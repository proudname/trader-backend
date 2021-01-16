import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { TradeHistoryEntity } from "../entity/trade-history.entity";

@Injectable()
export class TradeHistoryService extends TypeOrmCrudService<TradeHistoryEntity> {

  constructor(
    @InjectRepository(TradeHistoryEntity) private tradeHistoryRepository: Repository<TradeHistoryEntity>
  ) {
      super(tradeHistoryRepository);
  }

}
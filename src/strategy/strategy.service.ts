import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { StrategyEntity } from "./entity/strategy.entity";

@Injectable()
export class StrategyService extends TypeOrmCrudService<StrategyEntity> {
  constructor(@InjectRepository(StrategyEntity) repo) {
    super(repo);
  }
}
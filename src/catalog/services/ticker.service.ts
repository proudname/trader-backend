import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { TickerEntity } from "../entity/ticker.entity";

@Injectable()
export class TickerService extends TypeOrmCrudService<TickerEntity> {
  constructor(@InjectRepository(TickerEntity) repo) {
    super(repo);
  }
}
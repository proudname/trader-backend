import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { KeyPointEntity } from '../entity/key-point.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class KeyPointsService extends TypeOrmCrudService<KeyPointEntity> {

  constructor(@InjectRepository(KeyPointEntity) keyPointsRepository: Repository<KeyPointEntity>) {
    super(keyPointsRepository);
  }
}

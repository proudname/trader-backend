import { IBaseEntity } from '../../types';
import { PrimaryGeneratedColumn, BaseEntity as TypeormBaseEntity } from 'typeorm';


export abstract class BaseEntity extends TypeormBaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
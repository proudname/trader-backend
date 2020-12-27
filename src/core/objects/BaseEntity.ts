import { IBaseEntity } from '../../types';
import { PrimaryGeneratedColumn } from 'typeorm';


export abstract class BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
import { Entity, Column } from 'typeorm';
import { ITickerEntity } from '../../types';
import { BaseEntity } from '../../core/objects/BaseEntity';

@Entity()
export class TickerEntity extends BaseEntity implements ITickerEntity {

  @Column({unique: true})
  code: string;

  @Column()
  companyName: string;

  @Column()
  companyDescription: string;
}
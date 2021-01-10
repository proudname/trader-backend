import { Entity, Column } from 'typeorm';
import { ITickerEntity } from '../../types';
import { BaseEntity } from '@rasp/core';

@Entity()
export class TickerEntity extends BaseEntity implements ITickerEntity {

  @Column({unique: true})
  code: string;

  @Column({unique: true, nullable: false})
  figi: string;

  @Column()
  companyName: string;

  @Column()
  companyDescription: string;
}
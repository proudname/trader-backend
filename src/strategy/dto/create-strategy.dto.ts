import { KeyPointStatus, KeyPointType } from '../../enums';
import { ICreateStrategyDto } from '../../types';

export class CreateStrategyDto implements ICreateStrategyDto {
  id?: number;
  name: string;
  maxAmount: number;
  targetPrice: number;
  ticker: number;
  isActive: boolean;
  keyPoints: {
    prc: number;
    qty: number;
    status: KeyPointStatus;
    type: KeyPointType
    modified?: boolean
  }[]
}
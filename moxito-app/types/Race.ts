import { RaceStatus } from '../enums/Status';
import { Address } from './Address';
import { BaseUser } from './User';

export type Race = {
  createdAt: number;
  from: Address,
  to: Address, 
  customer: BaseUser,
  driver?: BaseUser,
  status: RaceStatus
}
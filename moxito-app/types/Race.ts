import { RaceStatus } from '../enums/Status';
import { Address } from './Address';
import { BaseUser } from './User';

export type Race = {
  createdAt: number; //milliseconds
  startedAt?: number; //milliseconds
  endedAt?: number; //milliseconds
  from: Address;
  to: Address;

  //estimations
  joinDistance: number; //meters
  raceDistance: number; //meters
  estimateDuration: number; //seconds
  price: number; //usd

  customer: BaseUser;
  driver?: BaseUser;
  status: RaceStatus;
};

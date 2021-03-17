import { RaceStatus } from '../enums/Status';
import { Address } from './Address';
import { Pos } from './Pos';
import { BaseUser } from './User';

export type Race = {
  createdAt: number; //milliseconds
  acceptedAt?: number; //milliseconds
  startedAt?: number; //milliseconds
  endedAt?: number; //milliseconds
  from: Address;
  to: Address;

  //estimations
  raceDistance: number; //kilometers
  estimateDuration: number; //minutes
  price: number; //usd

  customer: BaseUser;
  driver?: BaseUser;
  driverPos?: Pos;
  status: RaceStatus;
};

import { RaceStatus } from '../enums/Status';
import { Address } from '../types/Address';
import { Pos } from '../types/Pos';
import { Race } from '../types/Race';
import { User } from '../types/User';
import { racesRef } from './RaceManager';
import { getBaseUser } from './UserManager';

const geofire = require('geofire-common');

export function createRace(
  fromAddress: Address,
  toAddress: Address,
  distance: number,
  duration: number,
  price: number,
  callback?: (path: string) => void
) {
  
  const race: Race = {
    createdAt: Date.now(),
    from:{
      ...fromAddress,
      pos:{
        ...fromAddress.pos,
        hash: geofire.geohashForLocation([fromAddress.pos.latitude, fromAddress.pos.longitude])
      }
    },
    to: toAddress,
    customer: getBaseUser(),
    raceDistance: distance,
    estimateDuration: duration,
    price: price,
    status: RaceStatus.pending,
  };
  const docRef = racesRef.doc();
  docRef.set(race).then(() => callback && callback(docRef.id));
}
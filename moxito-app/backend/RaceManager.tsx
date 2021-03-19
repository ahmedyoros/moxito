import {
  useDocumentData,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import { db } from '../config';
import { RaceStatus, UserStatus } from '../enums/Status';
import { Pos } from '../types/Pos';
import { Race } from '../types/Race';
import { User } from '../types/User';
import { getBaseUser } from './UserManager';


export const racesRef = db.collection('races');

export function deleteRace(id: string) {
  racesRef.doc(id).delete();
}

export function declineRace(id: string, callback?: () => void) {
  racesRef
    .doc(id)
    .update({
      status: RaceStatus.pending,
    })
    .then(() => callback && callback());
}

export function acceptRace(
  user: User,
  callback?: () => void
) {
  racesRef
    .doc(user.currentRaceId!)
    .update({
      status: RaceStatus.pickingUp,
      acceptedAt: Date.now(),
      driver: {
        ...(getBaseUser()),
        motoModel:user.motoModel,
        pos: user.pos
      },
    })
    .then(() => callback && callback());
}

export function startRace(id: string){
  racesRef.doc(id).update({status: UserStatus.racing, startedAt: Date.now()});
}

export function endRace(id: string, callback?: () => void) {
  racesRef
    .doc(id)
    .update({ status: RaceStatus.over, endedAt: Date.now() })
    .then(() => callback && callback());
}

export function useRace(id: string): [Race, boolean] {
  const [race, loading] = useDocumentData<Race>(racesRef.doc(id));
  return [race!, loading];
}

export function getRace(id: string): [Race, boolean] {
  const [race, loading] = useDocumentDataOnce<Race>(racesRef.doc(id));
  return [race!, loading];
}

export function updateRacePrice(id: string, price: number){
  racesRef.doc(id).update({price: price});
}

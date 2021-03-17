import {
  useDocumentData,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import { db } from '../config';
import { RaceStatus, UserStatus } from '../enums/Status';
import { Pos } from '../types/Pos';
import { Race } from '../types/Race';
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
  id: string,
  driverPos: Pos,
  callback?: () => void
) {
  racesRef
    .doc(id)
    .update({
      status: RaceStatus.pickingUp,
      acceptedAt: Date.now(),
      driver: getBaseUser(),
      driverPos: driverPos,
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

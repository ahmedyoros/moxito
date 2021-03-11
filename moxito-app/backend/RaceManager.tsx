import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { useDocumentData, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { firebaseConfig } from '../config';
import { RaceStatus } from '../enums/Status';
import { Race } from '../types/Race';
import { getBaseUser } from './UserManager';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const racesRef = firebase.firestore().collection('races');

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

export function acceptRace(id: string, callback?: () => void) {
  racesRef
    .doc(id)
    .update({ status: RaceStatus.ongoing, startedAt: Date.now(), driver: getBaseUser() })
    .then(() => callback && callback());
}

export function endRace(id: string, callback?: () => void) {
  racesRef
    .doc(id)
    .update({ status: RaceStatus.over, endedAt: Date.now()})
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



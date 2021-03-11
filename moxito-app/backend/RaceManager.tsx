import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useCollection, useDocumentData, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { firebaseConfig } from '../config';
import { RaceStatus } from '../enums/Status';
import { Address } from '../types/Address';
import { Race } from '../types/Race';
import { getBaseUser } from './UserManager';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const racesRef = firebase.firestore().collection('races');

export function createRace(
  race: Race,
  callback?: (path: string) => void
) {
  const docRef = racesRef.doc();
  docRef.set(race).then(() => callback && callback(docRef.id));
}

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

export function useAvailableRace(): [string | null, boolean] {
  const [races, loading] = useCollection(
    racesRef.where('status', '==', RaceStatus.pending).limit(1)
  );

  if (loading || !races) return [null, true];
  const raceDoc = races.docs[0];
  if (!raceDoc) return [null, true];
  const id = raceDoc.id;

  racesRef.doc(id).update({ status: RaceStatus.accepting });
  return [id, false];
}

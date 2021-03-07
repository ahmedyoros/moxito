import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { User } from '../types/user';
import { hasNull as hasNullOrUndefined } from '../utils/hasNull';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { UserRef } from '../types/DocumentReferences';
import { firebaseConfig } from '../config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function useCurrentUser(): [User, boolean] {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  return useUser(fireUser);
}

function useUser(fireUser: firebase.User): [User, boolean] {
  const [userVal, userLoading] = useDocumentData<User>(
    db.doc('/users/' + fireUser.uid) as UserRef
  );
  const fireUserInfos = {
    email: fireUser.email!,
    photoURL: fireUser.photoURL!,
    displayName: fireUser.displayName!,
  }
  const user: User = {
    ...(userVal as User),
    id: fireUser.uid,
    ...fireUserInfos
  };
  const loading = userLoading || hasNullOrUndefined(fireUserInfos);
  
  return [user, loading];
}

export function newUser(infos: any, id: string, callback?: () => void) {
  db.doc('/users/' + id)
    .set(infos)
    .then(() => {
      if (callback) callback();
    });
}

export function updateCurrentUser(infos: any, callback?: () => void) {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  updateUser(fireUser.uid, infos, callback);
}

export function updateUser(id: string, infos: any, callback?: () => void) {
  db.doc('/users/' + id)
    .update(infos)
    .then(() => {
      if (callback) callback();
    });
}

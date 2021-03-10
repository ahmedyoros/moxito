import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { firebaseConfig } from '../config';
import { UserRef } from '../types/DocumentReferences';
import { BaseUser, User } from '../types/User';
import { hasNull as hasNullOrUndefined } from '../utils/hasNull';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const userRef = firebase.firestore().collection('users');

export function getFireUser(): firebase.User {
  return firebase.auth().currentUser!;
}

export default function useCurrentUser(): [User, boolean] {
  const fireUser: firebase.User = getFireUser();

  const [userVal, userLoading] = useDocumentData<User>(
    userRef.doc(fireUser.uid) as UserRef
  );

  const fireUserInfos = {
    email: fireUser.email!,
    photoURL: fireUser.photoURL!,
    displayName: fireUser.displayName!,
  };
  const user: User = {
    ...(userVal as User),
    id: fireUser.uid,
    ...fireUserInfos,
  };
  const loading = userLoading || hasNullOrUndefined(fireUserInfos);

  return [user, loading];
}

export function getBaseUser(): BaseUser {
  const user = getFireUser();
  return {
    photoURL: user.photoURL!,
    displayName: user.displayName!,
    id: user.uid,
  };
}

export function createUser(infos: any, id: string, callback?: () => void) {
  userRef
    .doc(id)
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
  userRef
    .doc(id)
    .update(infos)
    .then(() => {
      if (callback) callback();
    });
}

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {
  useDocumentData,
  useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import { firebaseConfig } from '../config';
import { Currency } from '../enums/Currency';
import { UserRef } from '../types/DocumentReferences';
import { BaseUser, defaultPictureUrl, User } from '../types/User';
import { hasNullOrUndefined } from '../utils/nullOrUndefined';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const userRef = firebase.firestore().collection('users');

export function getFireUser(): firebase.User {
  return firebase.auth().currentUser!;
}

function buildUser(fireUser: firebase.User, userVal: User | undefined) {
  const fireUserInfos = {
    email: fireUser.email!,
    photoURL: fireUser.photoURL!,
    displayName: fireUser.displayName!,
  };
  const user: User = {
    currency: Currency.gnf,
    ...(userVal as User),
    id: fireUser.uid,
    ...fireUserInfos,
  };
  return user;
}

export function useCurrentUser(): [User, boolean] {
  const fireUser: firebase.User = getFireUser();

  const [userVal, loading] = useDocumentData<User>(
    userRef.doc(fireUser.uid) as UserRef
  );

  const user: User = buildUser(fireUser, userVal);

  return [user, loading];
}

export function getCurrentUser(): [User, boolean] {
  const fireUser: firebase.User = getFireUser();

  const [userVal, loading] = useDocumentDataOnce<User>(
    userRef.doc(fireUser.uid) as UserRef
  );

  const user: User = buildUser(fireUser, userVal);

  return [user, loading];
}

export function getFullUser(baseUser: BaseUser): [User, boolean] {
  const [userVal, loading] = useDocumentDataOnce<User>(
    userRef.doc(baseUser.id)
  );
  const user: User = {
    ...(userVal as User),
    ...baseUser,
  };
  return [user, loading];
}

export function getBaseUser(): BaseUser {
  const user = getFireUser();

  return {
    photoURL: user.photoURL || defaultPictureUrl,
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
  updateUser(getBaseUser().id, infos, callback);
}

export function updateUser(id: string, infos: any, callback?: () => void) {
  userRef
    .doc(id)
    .update(infos)
    .then(() => {
      if (callback) callback();
    });
}

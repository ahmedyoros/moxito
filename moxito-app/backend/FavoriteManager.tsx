import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useCollectionData, useCollectionDataOnce, useDocumentDataOnce, useDocumentOnce } from 'react-firebase-hooks/firestore';
import { firebaseConfig } from '../config';
import { BaseUser, User } from '../types/User';
import { getBaseUser } from './UserManager';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const getFavRef = (userId: string) => {
  return firebase
    .firestore()
    .collection('users')
    .doc(getBaseUser().id)
    .collection('favoriteDrivers');
};

export const getFavoriteDrivers = (): [BaseUser[], boolean] => {
  const [drivers, loading] = useCollectionData<BaseUser>(
    getFavRef(getBaseUser().id)
  );
  if (loading) return [[], true];
  return [drivers!, false];
};

export const isFavoriteDriver = (driverId: string): [boolean, boolean] => {
  const [driverDoc, loading] = useDocumentOnce(
    getFavRef(getBaseUser().id).doc(driverId)
  );
  if (loading) return [false, true];
  return [driverDoc!.exists, false];
};

export const addFavoriteDriver = (driver: BaseUser) => {
  const favDoc = getFavRef(getBaseUser().id).doc(driver.id);
  favDoc.set(driver);
};

export const removeFavoriteDriver = (driverId: string) => {
  getFavRef(getBaseUser().id).doc(driverId).delete();
};

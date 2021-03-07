import firebase from 'firebase/app';
import 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { firebaseConfig } from '../config';
import { UsersRef } from '../types/DocumentReferences';
import { User } from '../types/user';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function useFavoritesDrivers(): [User[], boolean] {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  const [driverVal, loading] = useDocumentData<User[]>(
    db.doc('/favoriteDrivers/' + fireUser.uid) as UsersRef
  );
  const driver: User[] = (driverVal || []) as User[];
  return [driver, loading];
}

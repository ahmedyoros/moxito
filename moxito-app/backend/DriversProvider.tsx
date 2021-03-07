import firebase from 'firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { UsersRef } from '../types/DocumentReferences';
import { User } from '../types/user';

const db = firebase.firestore();

export default function useFavoritesDrivers(): [User[], boolean] {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  const [driverVal, loading] = useDocumentData<User[]>(db.doc('/favoriteDrivers/' + fireUser.uid) as UsersRef);
  const driver: User[] = (driverVal || []) as User[];
  return [driver, loading];
}
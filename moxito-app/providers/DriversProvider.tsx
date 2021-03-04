import firebase from 'firebase';
import { useObjectVal } from 'react-firebase-hooks/database';
import { User } from '../types/user';

export default function useFavoritesDrivers(): [User[], boolean] {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  const [driverVal, loading] = useObjectVal<User[]>(firebase.database().ref('/favoriteDrivers/' + fireUser.uid));
  const driver: User[] = (driverVal || []) as User[];
  return [driver, loading];
}
import firebase from 'firebase';
import { useObjectVal } from 'react-firebase-hooks/database';
import { Driver } from '../types/user';

export default function useFavoritesDrivers(): [Driver[], boolean] {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  const [driverVal, loading] = useObjectVal<Driver[]>(firebase.database().ref('/driveres/' + fireUser.uid));
  const driver: Driver[] = driverVal as Driver[];
  return [driver, loading];
}

export function loadFavoritesDrivers(): void {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  const driveres: Driver[] = [{
    street:'9 rue de lignières',
    city:'Saint-Quentin'
  }, {
    street: '10 rue john hadley',
    city: 'Lille'
  }];
  firebase.database().ref('/driveres/' + fireUser.uid).set(driveres)
}
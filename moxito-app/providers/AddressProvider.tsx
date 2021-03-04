import firebase from 'firebase';
import { useObjectVal } from 'react-firebase-hooks/database';
import { Address } from '../types/address';

export default function useFavoritesAdresses(): [Address[], boolean] {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  const [addressVal, loading] = useObjectVal<Address[]>(firebase.database().ref('/addresses/' + fireUser.uid));
  const address: Address[] = (addressVal || []) as Address[];
  return [address, loading];
}

export function loadFavoritesAddresses(): void {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  const addresses: Address[] = [{
    street:'9 rue de lignières',
    city:'Saint-Quentin'
  }, {
    street: '10 rue john hadley',
    city: 'Lille'
  }];
  firebase.database().ref('/addresses/' + fireUser.uid).set(addresses)
}
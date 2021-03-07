import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { Address } from '../types/address';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { AddressesRef } from '../types/DocumentReferences';
import { firebaseConfig } from '../config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function useFavoritesAdresses(): [Address[], boolean] {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  const [addressVal, loading] = useDocumentData<Address[]>(
    db.doc('/addresses/' + fireUser.uid) as AddressesRef
  );
  const address: Address[] = (addressVal || []) as Address[];
  return [address, loading];
}

export function loadFavoritesAddresses(): void {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  const addresses: Address[] = [
    {
      street: '9 rue de lignières',
      city: 'Saint-Quentin',
    },
    {
      street: '10 rue john hadley',
      city: 'Lille',
    },
  ];

  db.doc('/addresses/' + fireUser.uid).set(addresses);
}

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { Address } from '../types/Address';
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
  const addresses: Address[] = getSampleAddresses();

  db.doc('/addresses/' + fireUser.uid).set(addresses);
}

export function getSampleAddresses(): Address[] {
  return [
    {
      street: '9 rue de lignières',
      city: 'Saint-Quentin',
      coords: { lat: 49.8517, lon: 3.2831 }
    },
    {
      street: '10 rue john hadley',
      city: 'Lille',
      coords: { lat: 50.6098859, lon: 3.1518583 }
    },
  ];
}


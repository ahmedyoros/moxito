import { Address } from '../types/Address';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { AddressesRef } from '../types/DocumentReferences';
import { getBaseUser } from './UserManager';
import { db } from '../config';

export default function useFavoritesAdresses(): [Address[], boolean] {
  const [addressVal, loading] = useDocumentData<Address[]>(
    db.doc('/addresses/' + getBaseUser().id) as AddressesRef
  );
  const address: Address[] = (addressVal || []) as Address[];
  return [address, loading];
}

export function loadFavoritesAddresses(): void {
  const addresses: Address[] = getSampleAddresses();

  db.doc('/addresses/' + getBaseUser().id).set(addresses);
}

export function getSampleAddresses(): Address[] {
  return [
    {
      street: 'quelques part dans ',
      city: 'Cambrai',
      pos: { lat: 50.18457, lng: 3.24112 }, 
    },
    {
      street: '10 rue john hadley',
      city: 'Lille',
      pos: { lat: 50.6098859, lng: 3.1518583 }
    },
  ];
}


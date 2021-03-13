import {
  useCollectionData,
  useDocumentOnce,
} from 'react-firebase-hooks/firestore';
import { Address } from '../types/Address';
import { getBaseUser, userRef } from './UserManager';

const getFavRef = (userId: string) => {
  return userRef.doc(userId).collection('favoriteAddresses');
};

export const useFavoriteAddresses = (): [Address[], boolean] => {
  const [addresses, loading] = useCollectionData<Address>(
    getFavRef(getBaseUser().id)
  );
  if (loading) return [[], true];
  return [addresses!, false];
};

export const isFavoriteAddress = (addressId: string): [boolean, boolean] => {
  const [addressDoc, loading] = useDocumentOnce(
    getFavRef(getBaseUser().id).doc(addressId)
  );
  if (loading) return [false, true];
  return [addressDoc!.exists, false];
};

export const addFavoriteAddress = (address: Address) => {
  const favDoc = getFavRef(getBaseUser().id).doc();
  address.id = favDoc.id;
  favDoc.set(address);
};

export const removeFavoriteAddress = (addressId: string) => {
  getFavRef(getBaseUser().id).doc(addressId).delete();
};

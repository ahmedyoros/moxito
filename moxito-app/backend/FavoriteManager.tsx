import { useCollectionData, useDocument } from 'react-firebase-hooks/firestore';
import { Place } from 'react-native-google-places-autocomplete';
import { Address } from '../types/Address';
import { getBaseUser, userRef } from './UserManager';

const getFavRef = (userId: string) => {
  return userRef.doc(userId).collection('favoriteAddresses');
};

export function hash(address: Address) {
  return address.street + ', ' + address.city;
}

export const useFavoriteAddresses = (): [Address[], boolean] => {
  const [addresses, loading] = useCollectionData<Address>(
    getFavRef(getBaseUser().id)
  );
  if (loading) return [[], true];
  return [addresses!, false];
};

export const isFavoriteAddress = (
  address: Address | undefined
): [boolean, boolean] => {
  const addressId = address ? hash(address) : 'undefined';
  const [addressDoc, loading] = useDocument(
    getFavRef(getBaseUser().id).doc(addressId)
  );
  if (loading) return [false, true];
  return [addressDoc!.exists, false];
};

export const addFavoriteAddress = (address: Address) => {
  const favDoc = getFavRef(getBaseUser().id).doc(hash(address));
  favDoc.set(address);
};

export const removeFavoriteAddress = (address: Address) => {
  getFavRef(getBaseUser().id).doc(hash(address)).delete();
};

export const toPlace = (address: Address): Place => {
  return {
    description: hash(address),
    geometry: {
      location: {
        lat: address.pos.latitude,
        lng: address.pos.longitude,
      },
    },
  };
};

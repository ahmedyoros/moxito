import { Address } from "./Address";
import { User } from "./User";

export type UsersRef = firebase.firestore.DocumentReference<User[]>;
export type UserRef = firebase.firestore.DocumentReference<User>;

export type AddressRef = firebase.firestore.DocumentReference<Address>;
export type AddressesRef = firebase.firestore.DocumentReference<Address[]>;
import { Currency } from "../enums/Currency";
import { Role } from "../enums/Role";
import { UserStatus } from "../enums/Status";
import { Pos } from "./Pos";
import firebase from 'firebase/app';

export type BaseUser = {
  id: string;
  photoURL: string,
  displayName: string,
  email?: string,
}

export type FireUser = firebase.User;

export type User = BaseUser & {
  firstname: string,
  name?: string,
  email: string,
  lastLoggedIn?: number,
  createdAt: number,
  lastSeenAt: number,
  role: Role
  presentation?: string,
  motoModel?: string,
  immatriculation?: string,
  currency?: Currency | string,
  
  status: UserStatus
  searchRadius?: number
  pos?: Pos
  currentRaceId?: string,

  verified: boolean;
}

export const defaultPictureUrl = 'https://firebasestorage.googleapis.com/v0/b/moxito-a4531.appspot.com/o/defaultUser.png?alt=media&token=47dca24b-1744-42eb-b4e7-53ef20edcf5f';
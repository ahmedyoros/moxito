import { Role } from "../enums/Role";
import { Statut } from "../enums/Statut";

export type User = {
  id: string;
  firstname: string,
  name?: string,
  photoURL: string,
  email: string,
  lastLoggedIn?: number,
  createdAt: number,
  lastSeenAt: number,
  role: Role | string
  presentation?: string,
  motoModel?: string,
  immatriculation?: string,
  displayName: string,
  statut: Statut
}

export const defaultPictureUrl = 'https://firebasestorage.googleapis.com/v0/b/moxito-a4531.appspot.com/o/defaultUser.png?alt=media&token=47dca24b-1744-42eb-b4e7-53ef20edcf5f';
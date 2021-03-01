import firebase from "firebase";
import { useObjectVal } from "react-firebase-hooks/database";
import { Role } from "../types/role";

export type User = {
    firstname: string,
    name?: string,
    pictureUrl: string,
    email: string,
    lastLoggedIn?: number,
    createdAt: number,
    role: Role | string
}

export default function useUser(){
  return useObjectVal<User>(firebase.database().ref('/users/'+firebase.auth().currentUser!.uid))[0] as User;
}
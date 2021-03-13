import AsyncStorage from "@react-native-community/async-storage";
import { db } from "../config";
import { Request, RequestType } from "../types/Request";
import { getBaseUser, getBaseUserWithEmail } from "./UserManager";
export const reqRef = db.collection('requests');

export const createRequest = async (requestType: RequestType) => {
  if(!await isRequestSent(requestType)){
    const request: Request = {
      createdAt: Date.now(),
      type: requestType,
      accepted: false,
      user: getBaseUserWithEmail()
    } 
    reqRef.add(request).then(() => setRequestSent(requestType));
  }
}

const setRequestSent = async (requestType: RequestType) => {
  await AsyncStorage.setItem(getBaseUser().id+requestType, 'true');
}

const isRequestSent = async (requestType: RequestType) => {
  return await AsyncStorage.getItem(getBaseUser().id+requestType) === 'true';
}

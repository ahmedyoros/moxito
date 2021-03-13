import { BaseUser } from "./User";

export enum RequestType {
  accountVerification = 'accountVerification',
}

export type Request = {
  user: BaseUser;
  type: RequestType;
  createdAt: number;
  accepted: boolean;
}
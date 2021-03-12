import { Pos } from "./Pos";

export type Address = {
  id?: string,
  street: string,
  city: string,
  pos: Pos,
}
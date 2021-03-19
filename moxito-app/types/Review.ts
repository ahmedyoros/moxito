import { Role } from "../enums/Role"
import { BaseUser } from "./User"
export type Review = {
  reviewer: BaseUser
  ratings: (number | null)[]
}

export const reviewList = {
  [Role.Customer] : ["Ponctualité", "Confiance", "Paiement"],
  [Role.Driver] : ["Ponctualité", "Flexibilité", "Paiement"],
}
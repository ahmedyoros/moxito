import { Role } from "../enums/Role"
import { BaseUser } from "./User"
export type Review = {
  reviewer: BaseUser
  ratings: (number | null)[]
}

export const reviewList = {
  [Role.Customer] : ["Ponctualité", "Confiance", "Paiement"],
  [Role.Driver] : ["Ponctualité", "Fléxibilité", "Paiement"],
}

// export type UserReview = Review & {
//   punctuality: number
//   confidence: number
//   payment: number
// }

// export type DriverReview = Review & {
//   punctuality: number
//   flexibility: number
//   payment: number
// }
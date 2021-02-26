export enum Role {
  Customer = 'customer',
  Driver = 'driver',
  None = 'none',
}

export namespace Role {
  export function toString(role:Role) {
      return role == Role.Customer ? 'client' : 'chauffeur';
  }
}
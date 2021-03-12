export enum Role {
  Customer = 'customer',
  Driver = 'driver',
}

export namespace Role {
  export function toString(role:Role) {
      return role == Role.Customer ? 'client' : 'chauffeur';
  }

  export function opposite(role:Role) {
    return role == Role.Customer ? Role.Driver : Role.Customer;
  }
}
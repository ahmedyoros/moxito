export function hasNullOrUndefined(obj: Object): boolean {
  return Object.values(obj).some((x) => {
    return x === null || x === undefined;
  });
}

export function allNullOrUndefined(obj: Object): boolean {
  return Object.values(obj).every((x) => {
    return x === null || x === undefined;
  });
}

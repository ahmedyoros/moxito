export function hasNull(obj: Object): boolean {
  return Object.values(obj).some((x) => {
    return x === null || x === undefined;
  });
}

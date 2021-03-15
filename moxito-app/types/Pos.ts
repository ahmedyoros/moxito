import * as Location from 'expo-location';

export type Pos = {
  latitude: number,
  longitude: number,
  hash?: string,
}

export function toPos(location: Location.LocationObject): Pos{
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  }
}
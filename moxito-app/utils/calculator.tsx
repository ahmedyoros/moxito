import { Pos } from "../types/Pos";

const geofire = require('geofire-common');

export const getDistanceInKm = (p1: Pos, p2: Pos): number => {
  return geofire.distanceBetween(
    [p1.latitude, p1.longitude],
    [p2.latitude, p2.longitude]
  );
}

export const estimateDurationInMin = (distanceInKm: number, estimatedSpeed = 25): number => {
  return Math.round((distanceInKm / estimatedSpeed) * 60);
}
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { firebaseConfig } from '../config';
import { RaceStatus } from '../enums/Status';
import { Race } from '../types/Race';
import { racesRef } from './RaceManager';
import * as Location from 'expo-location';

const geofire = require('geofire-common');

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export function createRace(
  race: Race,
  callback?: (path: string) => void
) {
  const pos = race.from.pos;
  if(!pos.hash){
    const hash = geofire.geohashForLocation([pos.lat, pos.lng]);
    race.from.pos.hash = hash;
  }
  const docRef = racesRef.doc();
  docRef.set(race).then(() => callback && callback(docRef.id));
}

let interval: number;

function lookForDrivers(center: number[], radiusInM: number, callback: (docs: any[]) => void) {
  const bounds = geofire.geohashQueryBounds(center, radiusInM);
  const promises = [];
  for (const b of bounds) {
    promises.push(racesRef
      .where('status', '==', RaceStatus.pending)
      .orderBy('from.pos.hash')
      .startAt(b[0])
      .endAt(b[1]).get());
  }
  
  // Collect all the query results together into a single list
  return Promise.all(promises).then((snapshots) => {
    const matchingDocs = [];

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get('from.pos.lat');
        const lng = doc.get('from.pos.lng');
        // We have to filter out a few false positives due to GeoHash
        // accuracy, but most will match
        const distanceInKm = geofire.distanceBetween([lat, lng], center);
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM) {
          matchingDocs.push(doc);
        }
      }
    }

    return matchingDocs;
  }).then(callback)
}

export function stopSearching() {
  clearInterval(interval);
}

/**
 * @param radius searchRadius in meters
 */
export function searchClosestRace(location: Location.LocationObject, radius: number, callback: (raceId: string) => void) {
  const center = [location.coords.latitude, location.coords.longitude];

  interval = setInterval(_ => {
    lookForDrivers(center, radius, (raceDocs) => {
      if(raceDocs.length >= 1){
        clearInterval(interval);
        callback(raceDocs[0].id);
      }
    });
  }, 2000)
}

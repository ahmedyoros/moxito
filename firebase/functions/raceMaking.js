const config = require('./config');
const geofire = require('geofire-common');

driverRole = 'driver';
customerRole = 'customer';

const getSearchQuery = (role) => {
  return role === driverRole
      ? config.raceRef.where('status', '==', 'pending')
      : config.userRef.where('status', '==', 'searching').where('role', '==', driverRole);
};

exports.matchUpUser = async (docId, role, pos, radiusInM) => {
  const location = [pos.latitude, pos.longitude];
  const bounds = geofire.geohashQueryBounds(location, radiusInM);
  const promises = [];
  const posPath = role === driverRole ? 'from.' : '';

  for (const b of bounds) {
    promises.push(
      getSearchQuery(role)
        .orderBy(posPath + 'pos.hash')
        .startAt(b[0])
        .endAt(b[1])
        .get()
    );
  }

  const snapshots = await Promise.all(promises);

  let closest = null;
  let closestDistance = radiusInM;

  for (const snap of snapshots) {
    for (const doc of snap.docs) {
      const lat = doc.get(posPath + 'pos.latitude');
      const lng = doc.get(posPath + 'pos.longitude');
      console.log(lat, lng);
      const distanceInKm = geofire.distanceBetween([lat, lng], location);
      const distanceInM = distanceInKm * 1000;
      if (role === customerRole && distanceInKm > doc.get('searchRadius')) continue;
      if (distanceInM <= closestDistance) {
        closest = doc;
        closestDistance = distanceInM;
      }
    }
  }

  if (!closest) return;
  const raceId = role === customerRole ? docId : closest.id;
  const driverId = role === customerRole ? closest.id : docId;

  await config.raceDoc(raceId).update({
    status: 'accepting',
  });

  await config.userDoc(driverId).update({
    status: 'accepting',
    currentRaceId: raceId,
  });
}
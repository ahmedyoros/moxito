const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const userRef = db.collection('users');
const raceRef = db.collection('races');

exports.userRef = userRef;
exports.userDoc = (userId) => userRef.doc(userId);
exports.raceRef = raceRef;
exports.raceDoc = (raceId) => raceRef.doc(raceId);
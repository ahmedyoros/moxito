const functions = require('firebase-functions');

const utils = require('./utils');
const config = require('./config');
const raceMaking = require('./raceMaking');

const accountVerification = 'accountVerification';

const requestDoc = () => functions.firestore.document('requests/{requestId}');
const raceDoc = () => functions.firestore.document('races/{raceId}');

const APP_NAME = 'mOxitO';

exports.onRequestCreate = requestDoc().onCreate(async (snap, context) => {
  const request = {
    ...snap.data(),
    id: context.params.requestId,
  };

  if (request.type === accountVerification)
    return sendVerificationEmail(request);
});

exports.onRequestChange = requestDoc().onUpdate(async (change, context) => {
  const request = {
    ...change.after.data(),
    id: context.params.requestId,
  };

  if (request.type === accountVerification && request.accepted) {
    config.userDoc(request.user.id).update({ verified: true });
    return await utils.sendPushNotifications(user.request.id, {
      sound: 'default',
      body: '🏍️ Votre compte a été validé ✔️',
    });
  }
  return null;
});

exports.searchRace = functions.https.onCall(async (data, context) => {
  console.log(data.user.displayName + ', chauffeur, cherche une course dans un rayon de ' + data.searchRadius + 'km');
  await raceMaking.matchUpUser(data.user.id, 'driver', data.driverPos, data.searchRadius * 1000);
});

exports.notifyUser = functions.https.onCall(async (data, context) => {
  return await utils.sendPushNotifications(data.id, {
    sound: data.sound || 'default',
    body: data.message,
  });
});

exports.onRaceCreate = raceDoc().onCreate(async (snap, context) => {
  const race = snap.data();
  
  console.log(race.customer.displayName + ', client, cherche une course');
  await raceMaking.matchUpUser(context.params.raceId, 'customer', race.from.pos, 100 * 1000);
})

async function sendVerificationEmail(request) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: functions.config().gmail.email,
  };

  mailOptions.subject = `${APP_NAME} - new request : ${request.type}`;
  mailOptions.html = `
  Hellow devs :D <br/>
  new request created At : ${new Date(request.createdAt).toLocaleString()} <br/>
  ${request.user.displayName} <img src="${request.user.photoURL}" alt="${
    request.user.photoURL
  }"/> <br/>
  more user infos available here : https://console.firebase.google.com/u/2/project/moxito-a4531/firestore/data~2Fusers~2F${
    request.user.id
  } <br/>
  accept request here by <strong>setting 'accepted' field to true</strong> : https://console.firebase.google.com/u/2/project/moxito-a4531/firestore/data~2Frequests~2F${
    request.id
  } <br/>
  If needed, contact user by email : ${request.additionalData.email}
  `;
  return await utils.sendEmail(mailOptions);
}


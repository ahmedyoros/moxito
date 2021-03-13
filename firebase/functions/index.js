const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

const accountVerification = 'accountVerification';

admin.initializeApp();
const db = admin.firestore();
const userRef = (userId) => db.collection('users').doc(userId);
const requestDoc = () => functions.firestore.document('requests/{requestId}');

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = 'mOxitO';

exports.onRequestCreate = requestDoc().onCreate((requestDoc, context) => {
  const request = {
    ...requestDoc.data(),
    id: context.params.requestId,
  };

  if (request.type === accountVerification)
    return sendVerificationEmail(request);
});

exports.onRequestChange = requestDoc().onUpdate((change, context) => {
  const request = {
    ...change.after.data(),
    id: context.params.requestId,
  };

  if (request.type === accountVerification && request.accepted) {
    userRef(request.user.id).update({ verified: true });
    //TODO: send push notification
    console.log('user verified success :D');
  }
});

async function sendVerificationEmail(request) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: gmailEmail,
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
  If needed, contact user by email : ${request.user.email}
  `;
  return await mailTransport.sendMail(mailOptions, (error) => {
    if (error) {
      return console.log(error.toString());
    }
    return console.log('New verifcation email sent to ' + gmailEmail);
  });
}

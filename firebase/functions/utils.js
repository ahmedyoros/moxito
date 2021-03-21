const nodemailer = require('nodemailer');
const { Expo } = require('expo-server-sdk');
const config = require('./config');

const expo = new Expo();
const tokenRef = (userId, tokenId) =>
  config.userDoc(userId).collection('tokens').doc(tokenId);

exports.sendPushNotifications = async (userId, payload) => {
  const notificationDoc = await tokenRef(userId, 'notification').get();
  const pushToken = notificationDoc.data().data;

  if (!Expo.isExpoPushToken(pushToken)) {
    return console.error(
      `Push token ${pushToken} is not a valid Expo push token`
    );
  }

  return expo.sendPushNotificationsAsync([
    {
      ...payload,
      to: pushTokn,
    },
  ]);
}

exports.sendEmail = async (mailOptions) => {
  const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPassword,
    },
  });
  
  const gmailEmail = functions.config().gmail.email;
  const gmailPassword = functions.config().gmail.password;

  return await mailTransport.sendMail(mailOptions, (error) => {
    if (error) {
      return console.log(error.toString());
    }
    return console.log('New verifcation email sent to '+gmailEmail);
  });
}
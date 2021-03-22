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

  console.log(userId + 'va être notifié : ' + payload.body);

  const tickets = await expo.sendPushNotificationsAsync([
    {
      ...payload,
      to: pushToken,
    },
  ]);

  console.log(tickets[0].message);

  // await checkForNotificationErrors(tickets);
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

const checkForNotificationErrors = async (tickets) => {
  let receiptIds = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            console.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && details.error) {
              // The error codes are listed in the Expo documentation:
              // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
              // You must handle the errors appropriately.
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
}
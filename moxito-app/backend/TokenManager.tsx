import { userRef } from "./UserManager"
import * as Notifications from 'expo-notifications';

const getTokenRef = (userId: string) => userRef.doc(userId).collection('tokens')

const notificationKey = 'notification';

export const storeNotificationToken = async (userId: string) => {
  getTokenRef(userId).doc(notificationKey).set(await Notifications.getExpoPushTokenAsync())
}
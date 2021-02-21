import {
  API_KEY,
  AUTH_DOMAIN,
  DB_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASURMENT
} from '@env';

export const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DB_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASURMENT
}
import { firebaseConfig} from './config';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

class Fire {
  static shared: Fire;
  constructor() {
    this.init();
  }

  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  };

  get ref() {
    return firebase.database().ref('messages');
  }

  parse = (snapshot: { val?: any; key?: any; }) => {
    
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  on = (callback: (arg0: { _id: any; timestamp: Date; text: any; user: any; }) => any) =>
    this.ref
      .limitToLast(20)
      .on('child_added', (snapshot: { val?: any; key?: any; }) => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = (messages: string | any[]) => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,
      };
      console.log(message);
      
      this.append(message);
    }
  };

  append = (message: any) => this.ref.push(message);

  // close the connection to the Backend
  off() {
    this.ref.off();
  }
}

Fire.shared = new Fire();
export default Fire;

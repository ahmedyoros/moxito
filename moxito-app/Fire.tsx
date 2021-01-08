import firebase from 'firebase';

class Fire {
  static shared: Fire;
  constructor() {
    this.init();
    this.observeAuth();
  }

  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyABXgnEA7O5REXo5wCGq2UuGWpbHrTn8Cg",
        authDomain: "moxito-a4531.firebaseapp.com",
        databaseURL: "https://moxito-a4531.firebaseio.com",
        projectId: "moxito-a4531",
        storageBucket: "moxito-a4531.appspot.com",
        messagingSenderId: "17884074050",
        appId: "1:17884074050:web:f10aaf9836be7bad81dddb",
        measurementId: "G-M82CK7RT92"
      });
    }
  };

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = (user: any) => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref('messages');
  }

  parse = (snapshot: { val?: any; key?: any; }) => {
    console.log(snapshot);
    
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

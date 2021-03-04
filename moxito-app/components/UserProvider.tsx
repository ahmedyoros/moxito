import firebase from 'firebase';
import { useObjectVal } from 'react-firebase-hooks/database';
import { log } from 'react-native-reanimated';
import { User } from '../types/user';

export default function useUser(): [User, boolean] {
  const fireUser: firebase.User = firebase.auth().currentUser!;
  const [userVal, userLoading] = useObjectVal<User>(firebase.database().ref('/users/' + fireUser.uid));
  const user: User = { 
    ...(userVal as User),
    id: fireUser.uid,
    // createdAt: fireUser.metadata.creationTime,
    email: fireUser.email!,
    photoURL : fireUser.photoURL!,
    displayName: fireUser.displayName!
  };
  const loading = userLoading || hasNull(user);
  return [user, loading]
}

function hasNull(obj: Object): boolean {
  return Object.values(obj).some(x => {
    return (x === null || x === undefined)
  });
}

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import useTheme from '../themes/ThemeProvider';
import { BarTitle } from '../components/BarTitle';
import FacebookLogin from '../components/FacebookLogin';
import GoogleLogin from '../components/GoogleLogin';
import ManualLogin from '../components/ManualLogin';
import ManualSignup from '../components/ManualSignup';
import TwitterLogin from '../components/TwitterLogin';
import { firebaseConfig } from '../config';
import CommonStyle from '../styles/CommonStyle';
import LoginStyle from '../styles/LoginStyle';
import { NavigationProp } from '../types/navigation';
import { Role } from '../types/role';
import { User } from '../user/UserProvider';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

Login.navigationOptions = ({ navigation }: NavigationProp) => ({
  title: navigation.getParam('register')
    ? `S'inscrire comme ${Role.toString(navigation.getParam('role'))}`
    : 'Se connecter',
});

export default function Login({ navigation }: NavigationProp) {
  const register: boolean = navigation.getParam('register');
  const role: Role = navigation.getParam('role');
  const title = register ? "S'inscrire" : 'Se connecter';

  const [credential, setCredential] = useState<firebase.auth.OAuthCredential>();
  const [
    userCredential,
    setUserCredential,
  ] = useState<firebase.auth.UserCredential>();

  useEffect(() => {
    if (!credential) return;
    firebase.auth().signInWithCredential(credential!).then(setUserCredential);
  }, [credential]);

  useEffect(() => {
    if (!userCredential) return;
    const fireUser = userCredential!.user!;
    if (userCredential!.additionalUserInfo!.isNewUser) {
      const userProfile: any = userCredential!.additionalUserInfo!.profile!;
      const user: User = {
        email: fireUser.email!,
        pictureUrl: userProfile.picture,
        firstname: userProfile.given_name,
        name: userProfile.family_name || undefined,
        createdAt: Date.now(),
        role: navigation.getParam('role'),
      };
      firebase
        .database()
        .ref('/users/' + fireUser.uid)
        .set(user);
    } else {
      firebase
        .database()
        .ref('/users/' + fireUser.uid)
        .update({
          lastLoggedIn: Date.now(),
        });
    }
  }, [userCredential]);

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const loginStyle = LoginStyle(theme);

  return (
    <View style={commonStyle.container}>
      <BarTitle title={title + ' avec'} />
      <View style={loginStyle.providerIcons}>
        <GoogleLogin setCredential={setCredential} />
        <FacebookLogin setCredential={setCredential} />
        <TwitterLogin setCredential={setCredential} />
      </View>
      <BarTitle title={title + ' manuellement'} />
      <View>
        {register ? (
          <ManualSignup role={role} setCredential={setUserCredential} />
        ) : (
          <ManualLogin setCredential={setUserCredential} />
        )}
      </View>
    </View>
  );
}

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { BarTitle } from '../components/BarTitle';
import FacebookLogin from '../components/FacebookLogin';
import GoogleLogin from '../components/GoogleLogin';
import TwitterLogin from '../components/TwitterLogin';
import { firebaseConfig } from '../config';
import CommonStyle from '../styles/CommonStyle';
import LoginStyle from '../styles/LoginStyle';
import { useTheme } from '../themes/ThemeProvider';
import { NavigationProp } from '../types/navigation';
import { Role } from '../types/role';

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
  const title = register ? "S'inscrire" : 'Se connecter';

  const [credential, setCredential] = useState<firebase.auth.OAuthCredential | undefined>(undefined);

  useEffect(() => {
    if (!credential) return;
    firebase
      .auth()
      .signInWithCredential(credential!)
      .then((result) => {
        const user = result.user!;
        if (result.additionalUserInfo!.isNewUser) {

          const userProfile: any = result.additionalUserInfo!.profile!;
          firebase
            .database()
            .ref('/users/' + user.uid)
            .set({
              email: user.email,
              profile_picture: userProfile.picture,
              first_name: userProfile.given_name,
              last_name: userProfile.family_name || null,
              created_at: Date.now(),
            });

          firebase
            .firestore()
            .collection('user')
            .doc(user.uid)
            .set({
              role: navigation.getParam('role'),
            });
        } else {
          firebase
            .database()
            .ref('/users/' + user.uid)
            .update({
              last_logged_in: Date.now(),
            });
        }
      });
  });

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const loginStyle = LoginStyle(theme);

  return (
    <View style={[commonStyle.container]}>
      <BarTitle title={title + ' avec'} />
      <View style={loginStyle.providerIcons}>
        <GoogleLogin setCredential={setCredential} />
        <FacebookLogin setCredential={setCredential} />
        <TwitterLogin setCredential={setCredential} />
      </View>
      <BarTitle title={title + ' manuellement'} />
    </View>
  );
}
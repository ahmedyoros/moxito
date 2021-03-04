import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { BarTitle } from '../components/BarTitle';
import FacebookLogin from '../components/FacebookLogin';
import GoogleLogin from '../components/GoogleLogin';
import KeyboardAvoid from '../components/KeyboardAvoid';
import ManualLogin from '../components/ManualLogin';
import ManualSignup from '../components/ManualSignup';
import TwitterLogin from '../components/TwitterLogin';
import { firebaseConfig } from '../config';
import CommonStyle from '../styles/CommonStyle';
import LoginStyle from '../styles/LoginStyle';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';
import { Role } from '../types/Role';
import { User } from '../types/user';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function Login({ navigation, route }: NavigationProps) {
  const register: boolean = route.params!.register;
  const role: Role = route.params!.role || Role.Customer;
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
      const user: any = {
        firstname: userProfile.given_name || null,
        name: userProfile.family_name || null,
        role: role,
      };

      fireUser.updateProfile({
        displayName: fireUser.displayName || user.firstname || user.name,
        photoURL:
          typeof userProfile.picture === 'string'
            ? userProfile.picture
            : userProfile.picture.data.url,
      });
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
    <KeyboardAvoid>
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
    </KeyboardAvoid>
  );
}

import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createUser, updateCurrentUser } from '../backend/UserManager';
import { BarTitle } from '../components/BarTitle';
import FacebookLogin from '../components/FacebookLogin';
import GoogleLogin from '../components/GoogleLogin';
import KeyboardAvoid from '../components/KeyboardAvoid';
import Loading from '../components/Loading';
import ManualLogin from '../components/ManualLogin';
import ManualSignup from '../components/ManualSignup';
import { useDidMountEffect } from '../components/MyHooks';
import TwitterLogin from '../components/TwitterLogin';
import { firebaseConfig } from '../config';
import { Role } from '../enums/Role';
import { UserStatus } from '../enums/Status';
import CommonStyle from '../styles/CommonStyle';
import LoginStyle from '../styles/LoginStyle';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function Login({ route }: NavigationProps) {
  const register: boolean = route.params!.register;
  const role: Role = route.params!.role || Role.Customer;
  const title = register ? "S'inscrire" : 'Se connecter';

  const [credential, setCredential] = useState<firebase.auth.OAuthCredential>();
  const [
    userCredential,
    setUserCredential,
  ] = useState<firebase.auth.UserCredential>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!credential) return;
    firebase.auth().signInWithCredential(credential!).then(setUserCredential);
  }, [credential]);

  useEffect(() => {
    if (!userCredential) return;
    setLoading(true);
    const fireUser = userCredential!.user!;
    if (userCredential!.additionalUserInfo!.isNewUser) {
      const userProfile: any = userCredential!.additionalUserInfo!.profile!;
      const displayName = fireUser.displayName || '';
      const names = displayName.split(' ');
      let firstname = null;
      let lastname = null;
      if (names.length > 1) {
        firstname = names[0];
        names.shift();
        lastname = names.join(' ');
      }

      const userInfos: any = {
        createdAt: new Date(fireUser.metadata.creationTime!).getTime(),
        firstname: userProfile.given_name || firstname || displayName,
        name: userProfile.family_name || lastname || null,
        role: role,
        status: UserStatus.idle 
      };

      fireUser.updateProfile({
        displayName: displayName || userInfos.firstname || userInfos.name,
        photoURL:
          typeof userProfile.picture === 'string'
            ? userProfile.picture
            : userProfile.picture.data.url,
      });
      createUser(userInfos, fireUser.uid);
    } else {
      updateCurrentUser({ lastLoggedIn: Date.now() });
    }
  }, [userCredential]);

  useDidMountEffect(() => {

  }, [loading])

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const loginStyle = LoginStyle(theme);

  if(loading) return <Loading />;
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

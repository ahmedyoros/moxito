import firebase from 'firebase';
import React from 'react';
import { View } from 'react-native';
import { BarTitle } from '../components/BarTitle';
import MyButton from '../components/MyButton';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { NavigationProp } from '../types/navigation';
import useUser from '../user/UserProvider';

export default function MainMenu() {
  const user = useUser();
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  return (
    <View style={commonStyle.container}>
      <BarTitle title={user && 'Bonjour ' + user.firstname} />
      <MyButton
        title="Se déconnecter"
        onPress={() => firebase.auth().signOut()}
      />
    </View>
  );
}

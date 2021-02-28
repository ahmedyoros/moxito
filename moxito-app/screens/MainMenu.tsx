import firebase from 'firebase';
import React from 'react';
import { View } from 'react-native';
import Button from 'react-native-button';
import { BarTitle } from '../components/BarTitle';
import MyButton from '../components/MyButton';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { NavigationProp } from '../types/navigation';

export default function MainMenu({navigation}: NavigationProp) {
  const user = firebase.auth().currentUser!;
  
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  return (
    <View style={commonStyle.container}>
      <BarTitle title={'Bonjour ' + user.displayName} />
      <MyButton
        title="Se déconnecter"
        onPress={() => firebase.auth().signOut()}
      />
    </View>
  );
}
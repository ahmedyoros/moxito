import firebase from 'firebase';
import React from 'react';
import { View } from 'react-native';
import Button from 'react-native-button';
import { BarTitle } from '../components/BarTitle';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { NavigationProp } from '../types/navigation';

export default function MainMenu({navigation}: NavigationProp) {
  const user = firebase.auth().currentUser!;
  
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  return (
    <View style={commonStyle.centerLayout}>
      <BarTitle title={'Bonjour ' + user.displayName} />
      <Button
        style={commonStyle.button}
        onPress={() => firebase.auth().signOut()}
      >
        Sign out
      </Button>
    </View>
  );
}
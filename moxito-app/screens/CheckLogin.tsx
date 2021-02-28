import firebase from 'firebase';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationProp } from '../types/navigation';

export default function CheckLogin({ navigation }: NavigationProp) {
  firebase
    .auth()
    .onAuthStateChanged((user: firebase.User | null) =>
      navigation.navigate(user ? 'Logged' : 'NotLogged')
    );

  return (
    <View>
      <ActivityIndicator color="#fff" size="large" animating />
    </View>
  );
}

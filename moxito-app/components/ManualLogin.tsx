import firebase from 'firebase';
import 'firebase/auth';
import React from 'react';
import { View } from 'react-native';
import CommonStyle from '../styles/CommonStyle';
import LoginStyle from '../styles/LoginStyle';
import { Button, TextInput } from 'react-native-paper';
import useTheme from '../themes/ThemeProvider';
import { COLORS } from '../themes/colors';
import MyButton from './MyButton';

export default function ManualLogin({ setCredential }: any) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const signIn = (email: string, password: string) => {
    console.log(`email : ${email} password : ${password}`);
    // firebase.auth().createUserWithEmailAndPassword(email, password).then(
    //   (credential) => setCredential(credential)
    // )
  };

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const loginStyle = LoginStyle(theme);

  return (
    <View>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <MyButton
        title="Connexion"
        onPress={() => signIn(email, password)}
      />
    </View>
  );
}

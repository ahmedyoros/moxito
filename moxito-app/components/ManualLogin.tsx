import firebase from 'firebase';
import 'firebase/auth';
import React, { useState } from 'react';
import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import MyButton from './MyButton';

export default function ManualLogin({ setCredential }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fireError, setFireError] = useState('');

  const signIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then(setCredential)
      .catch(({ message }) => setFireError(message));
  };

  return (
    <View>
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <HelperText type="error" visible={fireError != ''}>
        {fireError}
      </HelperText>
      <MyButton title="Connexion" onPress={() => signIn()} />
    </View>
  );
}

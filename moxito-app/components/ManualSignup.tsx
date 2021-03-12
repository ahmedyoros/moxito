import firebase from 'firebase/app';
import 'firebase/auth';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { getFireUser } from '../backend/UserManager';
import { defaultPictureUrl } from '../types/User';
import MyButton from './MyButton';

export default function ManualSignUp({ role, setCredential }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState(false);
  const [fireError, setFireError] = useState('');

  const signUp = () => {
    if (confirmPassword !== password) return setPwError(true);

    firebase
      .auth()
      .createUserWithEmailAndPassword(email.trim(), password)
      .then((credential) => {
        credential.additionalUserInfo!.profile = {
          given_name: firstname.trim(),
          family_name: name.trim(),
          picture: defaultPictureUrl,
        };
        getFireUser().updateProfile({
          displayName: firstname.trim(), 
        });

        setCredential(credential);
      })
      .catch(({ message }) => setFireError(message));
  };

  return (
    <View>
      <TextInput label="Prénom" value={firstname} onChangeText={setFirstname} />
      <TextInput label="Nom" value={name} onChangeText={setName} />
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <HelperText type="error" visible={fireError != ''}>
        {fireError}
      </HelperText>
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        label="Confirmer"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <HelperText type="error" visible={pwError}>
        Les mots de passes ne correspondent pas.
      </HelperText>
      <MyButton title="Valider" onPress={() => signUp()} />
    </View>
  );
}

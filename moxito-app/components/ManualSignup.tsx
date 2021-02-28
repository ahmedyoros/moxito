import React from 'react';
import { TextInput, View } from 'react-native';
import Button from 'react-native-button';

export default function ManualLogin({ setCredential }: any) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const signIn = (username: string, password: string) => {
    console.log(`username : ${username} password : ${password}`);
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={() => signIn(username, password)}> Sign up</Button>
    </View>
  );
}

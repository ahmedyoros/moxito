import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import GoogleIcon from '../assets/logos/google.svg';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import * as Google from 'expo-auth-session/providers/google';
import { fireAuth } from '../config';

export default function GoogleLogin({ setCredential }: any) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: '17884074050-k9baaghs9rdcu4hhg5fgsu6durntcfch.apps.googleusercontent.com',
    expoClientId: '17884074050-bomed2vjon0qk496fet5rsasvvsak4bc.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      setCredential(
        fireAuth.GoogleAuthProvider.credential(response.params.id_token)
      );
    }
  }, [response]);

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  return (
    <TouchableOpacity
      disabled={!request}
      onPress={() => promptAsync()}
      style={[commonStyle.roundIcon, commonStyle.shadow]}
    >
      <Text>
        <GoogleIcon width={30} height={30} />
      </Text>
    </TouchableOpacity>
  );
}

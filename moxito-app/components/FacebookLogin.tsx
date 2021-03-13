import * as Facebook from 'expo-auth-session/providers/facebook';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import FacebookIcon from '../assets/logos/facebook.svg';
import { fireAuth } from '../config';
import { facebookConfig } from '../login.config';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';

export default function FacebookLogin({ setCredential }: any) {
  const [request, response, promptAsync] = Facebook.useAuthRequest(
    facebookConfig
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      setCredential(
        fireAuth.FacebookAuthProvider.credential(
          response.authentication!.accessToken
        )
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
        <FacebookIcon width={30} height={30} />
      </Text>
    </TouchableOpacity>
  );
}

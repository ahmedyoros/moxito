import * as Facebook from 'expo-auth-session/providers/facebook';
import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import FacebookIcon from '../assets/logos/facebook.svg';
import { facebookConfig } from '../login.config';
import CommonStyle from '../styles/CommonStyle';
import LoginStyle from '../styles/LoginStyle';
import useTheme from '../themes/ThemeProvider';

export default function FacebookLogin({setCredential}:any) {
  const [request, response, promptAsync] =  Facebook.useAuthRequest(facebookConfig);

  React.useEffect(() => {
    if (response?.type === 'success') {
      setCredential(firebase.auth.FacebookAuthProvider.credential(
        response.authentication!.accessToken,
      ));
    }
  }, [response]);

    const theme = useTheme();
    const commonStyle = CommonStyle(theme);
    const loginStyle = LoginStyle(theme);
    
    return (
        <TouchableOpacity
          disabled={!request}
          onPress={() => promptAsync()}
          style={[loginStyle.providerButton, commonStyle.shadow]}
        >
          <Text>
            <FacebookIcon width={30} height={30} />
          </Text>
        </TouchableOpacity>
    )
}

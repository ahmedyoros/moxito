import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import TwitterIcon from '../assets/logos/twitter.svg';
import CommonStyle from '../styles/CommonStyle';
import LoginStyle from '../styles/LoginStyle';
import useTheme from '../themes/ThemeProvider';

export default function TwitterLogin({ setCredential }: any) {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  return (
    <TouchableOpacity
      disabled={true}
      // onPress={() => promptAsync()}
      style={[commonStyle.roundIcon, commonStyle.shadow]}
    >
      <Text>
        <TwitterIcon width={30} height={30} />
      </Text>
    </TouchableOpacity>
  );
}

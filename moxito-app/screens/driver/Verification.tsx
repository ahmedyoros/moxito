import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Headline } from 'react-native-paper';
import { createRequest } from '../../backend/RequestManager';
import Loading from '../../components/Loading';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { UserProps } from '../../types/Props';
import { RequestType } from '../../types/Request';

export default function Verification({user}: UserProps) {
  useEffect(() => {
    createRequest(RequestType.accountVerification, {email : user.email});
  }, [])

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  
  return (
    <View style={commonStyle.container}>
      <Loading/>
      <Headline style={[commonStyle.text, {marginLeft: 10}]}>Avant de proposer une course, un administrateur doit valider votre compte. Cette opération peut prendre un certains temps. </Headline>
    </View>
  )
}


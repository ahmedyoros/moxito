import React from 'react'
import { View, Text } from 'react-native'
import { createRequest } from '../../backend/RequestManager';
import Loading from '../../components/Loading';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { UserProps } from '../../types/Props';
import { RequestType } from '../../types/Request';

export default function Verification({user}: UserProps) {
  createRequest(RequestType.accountVerification);

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  
  return (
    <View style={commonStyle.container}>
      <Loading/>
      <Text style={commonStyle.text}>Avant de proposer une course. Un administrateur doit valider votre compte. Cette opération peut prendre un certains temps</Text>
    </View>
  )
}


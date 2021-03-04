import React from 'react';
import { View, Text } from 'react-native';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';

export default function Drivers() {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  return (
    <View style={commonStyle.container}>
      <Text style={commonStyle.text}>Voici mes chauffeurs préférés</Text>
    </View>
  );
}

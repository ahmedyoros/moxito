import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import CommonStyle from '../styles/CommonStyle';
import { COLORS } from '../themes/colors';
import useTheme from '../themes/ThemeProvider';

export default function Loading({size = 90}) {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme)

  return (
    <View style={commonStyle.container}>
      <ActivityIndicator color={COLORS.orange} animating size={size} />
    </View>
  );
}

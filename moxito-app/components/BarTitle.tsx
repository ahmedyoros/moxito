import * as React from 'react';
import { Text, View } from 'react-native';
import CommonStyle from '../styles/CommonStyle';
import { useTheme } from '../themes/ThemeProvider';

type Title = {
  title: string;
}

export function BarTitle({title}: Title) {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.text }} />
      <View>
        <Text style={[commonStyle.text, {marginHorizontal:20, color: theme.colors.text}]}>{title}</Text>
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.text }} />
    </View>
  );
}

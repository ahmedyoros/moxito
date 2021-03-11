import React from 'react';
import { View, Text } from 'react-native';
import MoxitoStyle from '../styles/MoxitoStyle';
import { COLORS } from '../themes/colors';
import useTheme from '../themes/ThemeProvider';

type CrossTableProps = {
  child1: JSX.Element
  child2: JSX.Element
  child3: JSX.Element
  child4: JSX.Element
}

export default function CrossTable({child1, child2, child3, child4}: CrossTableProps) {
  const theme = useTheme();
  const moxitoStyle = MoxitoStyle(theme);
  const borderColor = COLORS.white;
  return (
    <View style={{marginVertical: 15}}>
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            width: '50%',
            height: '100%',
            borderColor: borderColor,
            borderBottomWidth: 1,
            borderRightWidth: 1,
            alignItems: 'center',
          }}
        >
          {child1}
        </View>
        <View
          style={{
            width: '50%',
            height: '100%',
            borderColor: borderColor,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            alignItems: 'center',
          }}
        >
          {child2}
        </View>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <View
          style={{
            width: '50%',
            height: '100%',
            borderColor: borderColor,
            borderTopWidth: 1,
            borderRightWidth: 1,
            alignItems: 'center',
          }}
        >
          {child3}
        </View>
        <View
          style={{
            width: '50%',
            height: '100%',
            borderColor: borderColor,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            alignItems: 'center',
          }}
        >
          {child4}
        </View>
      </View>
    </View>
  );
}

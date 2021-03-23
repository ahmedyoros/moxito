import React from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { COLORS } from '../themes/colors';

type Props = {
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
};

export default function Loading({ size, style, color }: Props) {
  const theme = useTheme();
  return (
    <ActivityIndicator
      color={color || theme.colors.primary}
      animating
      size={size || 90}
      style={style}
    />
  );
}

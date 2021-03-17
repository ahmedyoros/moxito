import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { COLORS } from '../themes/colors';

export default function Loading({size = 90}) {
  const theme = useTheme();
  return <ActivityIndicator color={theme.colors.primary} animating size={size} />
}

import React from 'react';
import { ActivityIndicator } from 'react-native';
import { COLORS } from '../themes/colors';

export default function Loading({size = 90}) {
  return <ActivityIndicator color={COLORS.orange} animating size={size} />
}

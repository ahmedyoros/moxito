import React from 'react';
import { View } from 'react-native';
import { Avatar as PaperAvatar } from 'react-native-paper';
import { COLORS } from '../themes/colors';

type Props = {
  imageUrl: string;
  size: number;
};

export default function Avatar({ imageUrl, size }: Props) {
  return (
    <View
      style={{
        borderWidth: 3,
        borderRadius: size / 2,
        borderColor: COLORS.orange,
        alignSelf: 'center',
      }}
    >
      <PaperAvatar.Image source={{ uri: imageUrl }} size={size} />
    </View>
  );
}

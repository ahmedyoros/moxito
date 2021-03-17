import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Avatar as PaperAvatar } from 'react-native-paper';
import { COLORS } from '../themes/colors';
import { defaultPictureUrl } from '../types/User';

type Props = {
  imageUrl: string;
  size: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>
};

export default function Avatar({ imageUrl, size, onPress, style }: Props) {
  const styles = StyleSheet.create({
    image: {
      borderWidth: 3,
      borderRadius: size / 2,
      borderColor: COLORS.orange,
      alignSelf: 'center',
    },
  });

  const image = (
    <PaperAvatar.Image
      key={{imageUrl}}
      source={{ uri: imageUrl || defaultPictureUrl }}
      size={size}
    />
  );

  if (onPress)
    return (
      <TouchableOpacity
        style={[styles.image, style]}
        onPress={() => onPress && onPress()}
      >
        {image}
      </TouchableOpacity>
    );
  return <View style={[styles.image, style]}>{image}</View>;
}

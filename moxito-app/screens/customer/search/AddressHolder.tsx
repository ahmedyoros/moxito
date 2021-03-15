import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { List } from 'react-native-paper';
import {
  addFavoriteAddress,
  isFavoriteAddress,
  removeFavoriteAddress,
} from '../../../backend/FavoriteManager';
import CommonStyle from '../../../styles/CommonStyle';
import { COLORS } from '../../../themes/colors';
import useTheme from '../../../themes/ThemeProvider';
import { Address } from '../../../types/Address';
import { MyRouteProp } from '../../../types/Props';

type Props = {
  suggestCurrentLocation: boolean;
  address: Address | undefined;
  title: string;
  index: string;
  searching: boolean;
};

export default function AddressHolder({
  suggestCurrentLocation,
  address,
  title,
  index,
  searching,
}: Props) {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const navigation = useNavigation();

  const [favorite] = isFavoriteAddress(address);

  return (
    <List.Item
      style={[
        {
          marginBottom: 5,
          backgroundColor: theme.colors.surface,
        },
        commonStyle.shadow,
      ]}
      key={index}
      title={address?.street}
      description={address?.city}
      right={(props) => (
        <>
          <TouchableOpacity
            onPress={() => {
              if (!address) return;
              if (!favorite) addFavoriteAddress(address);
              else removeFavoriteAddress(address);
            }}
          >
            <List.Icon
              {...props}
              icon="star"
              color={favorite ? theme.colors.primary : theme.colors.text}
            />
          </TouchableOpacity>
          {!searching && <List.Icon {...props} icon="magnify" />}
        </>
      )}
      onPress={() => {
        if (searching) return;
        navigation.navigate('AddressAutocomplete', {
          suggestCurrentLocation,
          address,
          title,
          index,
        });
      }}
    />
  );
}

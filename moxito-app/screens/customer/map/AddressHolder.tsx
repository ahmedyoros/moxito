import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { List } from 'react-native-paper';
import { color } from 'react-native-reanimated';
import {
  addFavoriteAddress,
  isFavoriteAddress,
  removeFavoriteAddress
} from '../../../backend/FavoriteManager';
import CommonStyle from '../../../styles/CommonStyle';
import { COLORS } from '../../../themes/colors';
import useTheme from '../../../themes/ThemeProvider';
import { Address } from '../../../types/Address';

type Props = {
  suggestCurrentLocation: boolean;
  address: Address | undefined;
  title: string;
  index: string;
  favoriteAddresses: Address[];
  searching: boolean;
};

export default function AddressHolder({
  suggestCurrentLocation,
  address,
  title,
  index,
  favoriteAddresses,
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
          height:60,
          marginVertical: 2,
          backgroundColor: theme.colors.surface
        },
        commonStyle.shadow,
      ]}
      titleStyle={{
        color: address ? theme.colors.text : COLORS.disabledGrey
      }}
      key={index}
      title={address?.street || title}
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
              color={favorite ? theme.colors.primary : COLORS.disabledGrey}
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
          favoriteAddresses
        });
      }}

    />
  );
}

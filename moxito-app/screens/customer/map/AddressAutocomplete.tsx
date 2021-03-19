import parseGooglePlace from 'parse-google-place';
import React, { useEffect, useRef, useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { TextInput } from 'react-native-paper';
import { hash, toPlace } from '../../../backend/FavoriteManager';
import Loading from '../../../components/Loading';
import CommonStyle from '../../../styles/CommonStyle';
import useTheme from '../../../themes/ThemeProvider';
import { Address } from '../../../types/Address';
import { NavigationProps } from '../../../types/Props';
import SuggestionItem from './SuggestionItem';

export default function AddressAutocomplete({
  navigation,
  route,
}: NavigationProps) {
  const suggestCurrentLocation: boolean = route.params!.suggestCurrentLocation;
  const address: Address | undefined = route.params!.address;
  const favoriteAddresses: Address[] = route.params!.favoriteAddresses;
  const title: string = route.params!.title;
  const index: string = route.params!.index;

  useEffect(() => {
    navigation.setOptions({ title: title });
  }, []);
  
  const ref = useRef<any>();
  
  useEffect(() => {
    ref.current?.focus();
  }, []);

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      keyboardShouldPersistTaps="always"
      placeholder={address ? hash(address) : title}
      onPress={(data, details) => {
        let street = data.description || details?.vicinity;
        let city = '';
        let object = parseGooglePlace(details);

        if (object.address != '') {
          street = object.address;
          city = object.city;
        }

        if (
          data.structured_formatting?.main_text &&
          data.structured_formatting?.secondary_text
        ) {
          street = data.structured_formatting.main_text;
          city = data.structured_formatting.secondary_text;
        }

        navigation.navigate('HomeMap', {
          [index + 'Address']: {
            street: street,
            city: city,
            pos: {
              latitude: details?.geometry.location.lat,
              longitude: details?.geometry.location.lng,
            },
          },
        });
      }}
      styles={{
        textInput: {
          color: theme.colors.text,
          backgroundColor: theme.colors.surface,
          ...commonStyle.shadow,
        },
        container: {
          backgroundColor: theme.colors.background,
        },
        listView: {
          paddingTop: 5,
        },
        row: {
          backgroundColor: theme.colors.surface,
        },
      }}
      listEmptyComponent={() => <Loading />}
      predefinedPlaces={favoriteAddresses.map(toPlace)}
      textInputProps={{
        InputComp: TextInput,
      }}
      currentLocation={suggestCurrentLocation}
      currentLocationLabel="Ma position"
      query={{
        key: 'AIzaSyABXgnEA7O5REXo5wCGq2UuGWpbHrTn8Cg',
        language: 'en',
      }}
      fetchDetails={true}
      renderRow={(data, idx) => (
        <SuggestionItem
          data={data}
          suggestCurrentLocation={suggestCurrentLocation}
          index={idx}
          currentInput={ref.current?.getAddressText()}
        />
      )}
      renderDescription={(data: any) => data.description || data.vicinity}
    />
  );
}

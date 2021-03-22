import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { getBaseUser, updateCurrentUser } from '../../backend/UserManager';
import { BarTitle } from '../../components/BarTitle';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { functions } from '../../config';
import { UserStatus } from '../../enums/Status';
import useTheme from '../../themes/ThemeProvider';
import { Pos, toPos } from '../../types/Pos';
import { UserProps } from '../../types/Props';
import * as Location from 'expo-location';
import usePermissions from 'expo-permissions-hooks';
const geofire = require('geofire-common');

export default function SearchRace({ user }: UserProps) {
  const searchRace = functions.httpsCallable('searchRace');
  const { isGranted, ask } = usePermissions('LOCATION');

  useEffect(() => {
    let watchPosition: Promise<{ remove(): void }> | null = null;
    if (isGranted) {
      watchPosition = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 100,
        },
        (location) => {
          const pos = toPos(location);
          const fullPos: Pos = {
            ...pos,
            hash: geofire.geohashForLocation([pos.latitude, pos.longitude]),
          };

          console.log('searching for a race... :)');
          
          updateCurrentUser({ pos: fullPos });
          
          searchRace({
            user: getBaseUser(),
            driverPos: fullPos,
            searchRadius: user.searchRadius,
          });
        }
      );
    } else ask();

    return () => {
      if (!watchPosition) return;
      console.log('stop watchPosition');
      
      watchPosition.then(({ remove }) => remove());
    };
  }, [isGranted]);

  const theme = useTheme();
  return (
    <View>
      <BarTitle title="Recherche d'une course en cours" />
      <Loading />
      <MyButton
        title="Ne plus accepter de course"
        onPress={() => {
          updateCurrentUser({ status: UserStatus.idle });
        }}
      />
    </View>
  );
}

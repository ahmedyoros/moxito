import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  searchClosestRace as findClosestRace,
  stopSearching
} from '../../backend/RaceMaker';
import { updateCurrentUser } from '../../backend/UserManager';
import { BarTitle } from '../../components/BarTitle';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { UserStatus } from '../../enums/Status';
import useTheme from '../../themes/ThemeProvider';
import * as Location from 'expo-location';
import { UserProps } from '../../types/Props';

export default function SearchRace({user} : UserProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if(!location) return;
    findClosestRace(location, user.searchRadius!, (raceId: string) => {
      updateCurrentUser({
        status: UserStatus.accepting,
        currentRaceId: raceId,
      });
    });
    return () => stopSearching();
  }, [location]);

  const theme = useTheme();
  return (
    <View>
      <BarTitle title="Recherche d'une course en cours" />
      <Loading />
      <MyButton
        title="Ne plus accepter de course"
        onPress={() => updateCurrentUser({ status: UserStatus.idle })}
      />
    </View>
  );
}

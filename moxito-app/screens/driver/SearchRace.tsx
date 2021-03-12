import * as Location from 'expo-location';
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
import { UserProps } from '../../types/Props';

export default function SearchRace({user} : UserProps) {
  const [pos, setPos] = useState(user.pos);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setPos({
        lat:location.coords.latitude,
        lng:location.coords.longitude
      });
    })();
  }, []);

  useEffect(() => {
    if(!pos) return;
    findClosestRace(pos, user.searchRadius!, (raceId: string) => {
      updateCurrentUser({
        status: UserStatus.accepting,
        currentRaceId: raceId,
        pos: pos
      });
    });
    return () => stopSearching();
  }, [pos]);

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

import * as Location from 'expo-location';
import usePermissions from 'expo-permissions-hooks';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { searchClosestRace, stopSearching } from '../../backend/RaceMaker';
import { updateCurrentUser } from '../../backend/UserManager';
import { BarTitle } from '../../components/BarTitle';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { UserStatus } from '../../enums/Status';
import useTheme from '../../themes/ThemeProvider';
import { Pos, toPos } from '../../types/Pos';
import { UserProps } from '../../types/Props';

export default function SearchRace({user} : UserProps) {
  const [pos, setPos] = useState<Pos>();
  const { isGranted, ask } = usePermissions('LOCATION');

  useEffect(() => {
    if (isGranted)
      Location.getCurrentPositionAsync().then((position) =>
        setPos(toPos(position))
      )
    else ask();
  }, [isGranted]);

  useEffect(() => {
    if (!pos) return;
    searchClosestRace(pos, user.searchRadius!, (raceId: string) => {
      updateCurrentUser({
        status: UserStatus.accepting,
        currentRaceId: raceId,
        pos: pos,
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
        onPress={() => {
          updateCurrentUser({ status: UserStatus.idle });
        }}
      />
    </View>
  );
}

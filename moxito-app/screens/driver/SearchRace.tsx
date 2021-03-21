import React from 'react';
import { View } from 'react-native';
import { getBaseUser, updateCurrentUser } from '../../backend/UserManager';
import { BarTitle } from '../../components/BarTitle';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { functions } from '../../config';
import { UserStatus } from '../../enums/Status';
import useTheme from '../../themes/ThemeProvider';
import { UserProps } from '../../types/Props';

export default function SearchRace({ user }: UserProps) {
  const searchRace = functions.httpsCallable('searchRace');
  searchRace({
    user: getBaseUser(),
    driverPos: user.pos,
    searchRadius: user.searchRadius,
  })

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

import React from 'react';
import { View } from 'react-native';
import { deleteRace } from '../../backend/RaceManager';
import { updateCurrentUser } from '../../backend/UserManager';
import { BarTitle } from '../../components/BarTitle';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { deleteField } from '../../config';
import { UserStatus } from '../../enums/Status';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { UserProps } from '../../types/Props';

export default function SearchDriver({user} : UserProps) {
  const cancel = () => {
    deleteRace(user.currentRaceId!);
    updateCurrentUser({
      status: UserStatus.idle,
      currentRaceId: deleteField(),
    });
  }

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  return (
    <View style={commonStyle.container}>
      <BarTitle title={"Recherche en cours..."}/>
      <Loading />
      <MyButton title="Annuler" onPress={cancel} />
    </View>
  )
}

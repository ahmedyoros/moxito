import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useAvailableRace } from '../../backend/RaceManager';
import { updateCurrentUser } from '../../backend/UserManager';
import { BarTitle } from '../../components/BarTitle';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { UserStatus } from '../../enums/Status';
import useTheme from '../../themes/ThemeProvider';

export default function SearchRace() {
  const [id, searching] = useAvailableRace();
  
  useEffect(() => {
    if (!searching) updateCurrentUser({status: UserStatus.accepting, currentRaceId: id!})
  }, [searching]);

  const theme = useTheme();
  return (
    <View>
      <BarTitle title="Recherche d'une course en cours" />
      <Loading />
      <MyButton
        title="Ne plus accepter de course"
        onPress={() => updateCurrentUser({status: UserStatus.idle})}
      />
    </View>
  );
}


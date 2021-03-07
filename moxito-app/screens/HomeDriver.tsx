import React from 'react';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { BarTitle } from '../components/BarTitle';
import MyButton from '../components/MyButton';
import { Statut } from '../enums/Statut';
import { updateCurrentUser } from '../backend/UserManager';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { UserProps } from '../types/Props';
import SandTimer from '../assets/icons/sand-timer.svg';

export default function HomeDriver({ user }: UserProps) {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  const [statut, setStatut] = useState(user.statut);

  const setAvailable = () => {
    setStatut(Statut.available);
    updateCurrentUser({ statut: Statut.available });
  };

  const setIdle = () => {
    setStatut(Statut.idle);
    updateCurrentUser({ statut: Statut.idle });
  };

  return (
    <View style={commonStyle.container}>
      {statut === Statut.available ? (
        <>
          <SandTimer />
          <BarTitle title="Recherche d'une course en cours" />
        </>
      ) : (
        <BarTitle title="Vous êtes actuellement hors-ligne" />
      )}
      {statut === Statut.idle ? (
        <MyButton title="Ne rendre disponible" onPress={setAvailable} />
      ) : (
        <MyButton title="Ne plus accepter de course" onPress={setIdle} />
      )}
    </View>
  );
}

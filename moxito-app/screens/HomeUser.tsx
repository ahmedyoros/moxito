import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { BarTitle } from '../components/BarTitle';
import MyButton from '../components/MyButton';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { UserProps } from '../types/Props';
import SandTimer from '../assets/icons/sand-timer.svg';
export default function HomeUser({ user }: UserProps) {
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  const [searching, setSearching] = useState(false);
  const search = () => {
    setSearching(true);
  };

  return (
    <View style={commonStyle.container}>
      <BarTitle title="Où allez vous ?" />
      <TextInput placeholder="Destination" />
      {searching ? (
        <MyButton title="Rechercher" onPress={search} />
      ) : (
        <>
          <SandTimer />
          <Text style={commonStyle.text}>Recherche en cours...</Text>
        </>
      )}
    </View>
  );
}

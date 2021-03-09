import React from 'react';
import { Text, View } from 'react-native';
import { useRace } from '../../backend/RaceManager';
import Avatar from '../../components/Avatar';
import Loading from '../../components/Loading';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { UserProps } from '../../types/Props';

export default function FollowDriver({user}: UserProps) {
  const [race, loading] = useRace(user.currentRaceId!)
  
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  if(loading) return <Loading />;
  return (
    <View style={commonStyle.container}>
      <Avatar size={50} imageUrl={race.driver!.photoURL} />
      <Text style={[commonStyle.text, {alignSelf: 'center' }]}>{race.driver!.displayName} arrive bientôt !</Text>
    </View>
  )
}

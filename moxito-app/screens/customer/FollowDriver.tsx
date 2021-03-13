import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useRace } from '../../backend/RaceManager';
import Avatar from '../../components/Avatar';
import Loading from '../../components/Loading';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { NavigationProps } from '../../types/Props';
import { User } from '../../types/User';

export default function FollowDriver({navigation, route}: NavigationProps) {
  const user: User = route.params!.user;
  const [race, loading] = useRace(user.currentRaceId!)
  
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  if(loading) return <Loading />;
  return (
    <View
      style={[
        commonStyle.container,
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Avatar size={50} imageUrl={race.driver!.photoURL} onPress={() => navigation.navigate('Profile', race.driver)} />
      <Text style={[commonStyle.text, {alignSelf: 'center' }]}>{race.driver!.displayName} arrive bientôt !</Text>
      <FontAwesome5
        style={[commonStyle.roundIcon, commonStyle.shadow]}
        name="rocketchat"
        size={24}
        color={theme.colors.primary}
        onPress={() => navigation.navigate('Chat', { race: race, user: user })}
      />
    </View>
  )
}

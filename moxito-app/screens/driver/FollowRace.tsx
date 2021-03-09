import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useRace } from '../../backend/RaceManager';
import Avatar from '../../components/Avatar';
import Loading from '../../components/Loading';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { UserProps } from '../../types/Props';

export default function FollowRace({ user: user }: UserProps) {
  const [race, loading] = useRace(user.currentRaceId!)
  const chat = () => {};

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  if (loading) return <Loading />;
  return (
    <View
      style={[
        commonStyle.container,
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Avatar size={50} imageUrl={race.customer.photoURL} />
      <Text style={[commonStyle.text, { alignSelf: 'center' }]}>
        En course avec {race.customer.displayName}. Il faut aller de{' '}
        {race.from.street}, {race.from.city} à {race.to.street}, {race.to.city}
      </Text>
      <FontAwesome5
        style={[commonStyle.roundIcon, commonStyle.shadow]}
        name="rocketchat"
        size={24}
        color={theme.colors.primary}
        onPress={() => console.log('coucou')}
      />
    </View>
  );
}

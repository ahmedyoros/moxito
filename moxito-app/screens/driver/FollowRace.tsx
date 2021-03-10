import { FontAwesome5 } from '@expo/vector-icons';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import React from 'react';
import { Text, View } from 'react-native';
import { endRace, useRace } from '../../backend/RaceManager';
import { updateCurrentUser, updateUser } from '../../backend/UserManager';
import Avatar from '../../components/Avatar';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { UserStatus } from '../../enums/Status';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { NavigationProps, UserProps } from '../../types/Props';
import { User } from '../../types/User';

export default function FollowRace({ navigation, route }: NavigationProps) {
  const user: User = route.params!.user;
  const [race, loading] = useRace(user.currentRaceId!);
  const chat = () => {};

  const finish = () => {
    endRace(user.currentRaceId!, () => {
      updateCurrentUser({
        status: UserStatus.idle,
        currentRaceId: firebase.firestore.FieldValue.delete(),
      });
      updateUser(race.customer.id, {
        status: UserStatus.idle,
        currentRaceId: firebase.firestore.FieldValue.delete(),
      });
    });
  };

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
        En course avec {race.customer.displayName}. Il faut aller de
        {race.from.street}, {race.from.city} à {race.to.street}, {race.to.city}
      </Text>
      <FontAwesome5
        style={[commonStyle.roundIcon, commonStyle.shadow]}
        name="rocketchat"
        size={24}
        color={theme.colors.primary}
        onPress={() => navigation.navigate('Chat', { race: race, user: user })}
      />
      <MyButton title="Terminer la course" onPress={finish} />
    </View>
  );
}

import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { endRace } from '../../backend/RaceManager';
import { updateCurrentUser, updateUser } from '../../backend/UserManager';
import Avatar from '../../components/Avatar';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { UserStatus } from '../../enums/Status';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { MyNavigationProp } from '../../types/Props';
import { Race } from '../../types/Race';
import { User } from '../../types/User';

type Props = {
  user: User,
  race: Race | undefined
}

export default function FollowRace({user, race}: Props) {
  const navigation: MyNavigationProp = useNavigation();

  const finish = () => {
    endRace(user.currentRaceId!, () => {
      updateCurrentUser({
        status: UserStatus.arrived
      });
      updateUser(race!.customer.id, {
        status: UserStatus.arrived
      });
    });
  };

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  if (!race) return <Loading />;
  return (
    <View
      style={[
        commonStyle.container,
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Avatar size={50} imageUrl={race.customer.photoURL} onPress={() => navigation.navigate('Profile', race.customer)}/>
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

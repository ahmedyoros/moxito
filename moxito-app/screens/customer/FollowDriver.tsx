import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import Avatar from '../../components/Avatar';
import Loading from '../../components/Loading';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { MyNavigationProp } from '../../types/Props';
import { Race } from '../../types/Race';
import { User } from '../../types/User';

type Props = {
  user: User,
  race: Race | undefined
}

export default function FollowDriver({user, race}: Props){
  const navigation: MyNavigationProp = useNavigation();
  
  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  if(!race) return <Loading />;
  return (
    <View
      style={[
        commonStyle.container,
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Avatar size={50} imageUrl={race.driver!.photoURL} onPress={() => navigation.navigate('Profile', {user:race.driver})} />
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

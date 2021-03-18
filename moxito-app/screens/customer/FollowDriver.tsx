import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View, Image } from 'react-native';
import { Subheading } from 'react-native-paper';
import Avatar from '../../components/Avatar';
import Loading from '../../components/Loading';
import CommonStyle from '../../styles/CommonStyle';
import { COLORS } from '../../themes/colors';
import useTheme from '../../themes/ThemeProvider';
import { MyNavigationProp, UserRaceProps } from '../../types/Props';
import { estimateDurationInMin, getDistanceInKm } from '../../utils/calculator';
import SandTimer from '../../assets/icons/sand-timer.svg';
import { RaceStatus } from '../../enums/Status';
import { hash } from '../../backend/FavoriteManager';
import { getImage } from '../../utils/getImage';

export default function FollowDriver({ user, race }: UserRaceProps) {
  const navigation: MyNavigationProp = useNavigation();

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  if (!race) return <Loading />;

  const picking = race.status === RaceStatus.pickingUp;

  const distance = picking
    ? getDistanceInKm(race.driverPos!, race.from.pos)
    : getDistanceInKm(race.from.pos, race.to.pos);

  return (
    <View style={commonStyle.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={{ flexDirection: 'column', marginLeft: 15, marginTop: 15 }}
        >
          <Avatar
            size={50}
            imageUrl={race.driver!.photoURL}
            onPress={() =>
              navigation.navigate('Profile', { user: race.driver })
            }
          />
          <Subheading style={{ color: theme.colors.primary, textAlign: 'center' }}>
            Profil
          </Subheading>
        </View>
        <View style={{ marginTop: 20 }}>
          {picking ? (
            <SandTimer />
          ) : (
            <Image
              source={getImage('1')}
              style={{ flex: 1, aspectRatio: 2, resizeMode: 'contain' }}
            />
          )}
        </View>
        <View
          style={{ flexDirection: 'column', marginRight: 15, marginTop: 15 }}
        >
          <FontAwesome5
            style={[commonStyle.roundIcon, commonStyle.shadow]}
            name="rocketchat"
            size={24}
            color={theme.colors.primary}
            onPress={() =>
              navigation.navigate('Chat', { race: race, user: user })
            }
          />
          <Subheading style={{ color: theme.colors.primary, textAlign: 'center' }}>
            chat
          </Subheading>
        </View>
      </View>
      <Text
        style={[
          commonStyle.text,
          { textAlign: 'center', marginTop: 40, marginHorizontal: 40 },
        ]}
      >
        {picking
          ? `Votre chaffeur ${race.driver!.displayName} arrive`
          : `Arrivée prévue à ${hash(race.to)}`}{' '}
        dans environ {estimateDurationInMin(distance)} min, soit{' '}
        {distance.toFixed(1)} Km.
      </Text>
    </View>
  );
}

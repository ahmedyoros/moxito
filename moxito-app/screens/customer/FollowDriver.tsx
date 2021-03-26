import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import SandTimer from '../../assets/icons/sand-timer.svg';
import { hash } from '../../backend/FavoriteManager';
import Avatar from '../../components/Avatar';
import ChatButton from '../../components/ChatButton';
import Loading from '../../components/Loading';
import { RaceStatus } from '../../enums/Status';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { MyNavigationProp, UserRaceProps } from '../../types/Props';
import { estimateDurationInMin, getDistanceInKm } from '../../utils/calculator';
import { getModelImage } from '../../utils/motoModel';

export default function FollowDriver({ user, race }: UserRaceProps) {
  const navigation: MyNavigationProp = useNavigation();

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if(!race) return;
    setDistance(picking 
    ? getDistanceInKm(race.driver!.pos!, race.from.pos)
    : getDistanceInKm(race.from.pos, race.to.pos));
  }, [race])

  if (!race) return <Loading />;
  
  const picking = race.status === RaceStatus.pickingUp;
  
  
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
              source={getModelImage(race.driver!.motoModel!)}
              style={{ flex: 1, aspectRatio: 2, resizeMode: 'contain' }}
            />
          )}
        </View>
        <ChatButton race={race} user={user}/>
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

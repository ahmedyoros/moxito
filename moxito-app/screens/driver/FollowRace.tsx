import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import { hash } from '../../backend/FavoriteManager';
import { endRace, startRace } from '../../backend/RaceManager';
import { updateCurrentUser, updateUser } from '../../backend/UserManager';
import Avatar from '../../components/Avatar';
import ChatButton from '../../components/ChatButton';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { RaceStatus, UserStatus } from '../../enums/Status';
import CommonStyle from '../../styles/CommonStyle';
import useTheme from '../../themes/ThemeProvider';
import { MyNavigationProp, UserRaceProps } from '../../types/Props';
import { estimateDurationInMin, getDistanceInKm } from '../../utils/calculator';

export default function FollowRace({ user, race }: UserRaceProps) {
  const navigation: MyNavigationProp = useNavigation();

  const pickedUp = () => {
    startRace(user.currentRaceId!);
  };

  const finish = () => {
    endRace(user.currentRaceId!, () => {
      updateCurrentUser({
        status: UserStatus.arrived,
      });
      updateUser(race!.customer.id, {
        status: UserStatus.arrived,
      });
    });
  };

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if(!race) return;
    setDistance(picking 
    ? getDistanceInKm(race.driver!.pos!, race.from.pos)
    : getDistanceInKm(race.driver!.pos!, race.to.pos));
  }, [race])

  if (!race) return <Loading />;

  const picking = race.status === RaceStatus.pickingUp;


  return (
    <View style={[commonStyle.container, { paddingHorizontal: 5 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={{ flexDirection: 'column', marginLeft: 15, marginTop: 15 }}
        >
          <Avatar
            size={50}
            imageUrl={race.customer!.photoURL}
            onPress={() =>
              navigation.navigate('Profile', { user: race.customer })
            }
          />
          <Subheading
            style={{ color: theme.colors.primary, textAlign: 'center' }}
          >
            Profil
          </Subheading>
        </View>
        <View style={{ flexDirection: 'column', marginTop: 10 }}>
          <Text style={[commonStyle.text, { textAlign: 'center' }]}>
            {picking ? 'Rejoindre\n' : 'En course avec \n'}{' '}
            {race.customer.displayName + ' '}
          </Text>
          <Text style={[commonStyle.text, { textAlign: 'center' }]}>
            {estimateDurationInMin(distance)} min
          </Text>
          <Text style={[commonStyle.text, { textAlign: 'center' }]}>
            {distance.toFixed(1)} Km
          </Text>
        </View>
        <ChatButton race={race} user={user}/>
      </View>
      <Text
        style={[
          commonStyle.text,
          { textAlign: 'center', marginTop: 10, marginHorizontal: 20 },
        ]}
      >
        {picking ? 'Départ de' : 'Arrivée à'}{' '}
        {hash(picking ? race.from : race.to)}
      </Text>
      {picking ? (
        <MyButton
          title={`Client récupéré`}
          icon={'account-check'}
          onPress={pickedUp}
        />
      ) : (
        <MyButton
          title={`Terminer la course`}
          icon={'check-outline'}
          onPress={finish}
        />
      )}
    </View>
  );
}

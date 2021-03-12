import * as firebase from 'firebase/app';
import 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Animated, ImageBackground, View } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Title } from 'react-native-paper';
import Moxito from '../../assets/logos/moxito-w.svg';
import { acceptRace, declineRace, getRace } from '../../backend/RaceManager';
import { updateCurrentUser, updateUser } from '../../backend/UserManager';
import CrossTable from '../../components/CrossTable';
import CrossTableCell from '../../components/CrossTableCell';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import fx from '../../currency.config';
import { UserStatus } from '../../enums/Status';
import CommonStyle from '../../styles/CommonStyle';
import MoxitoStyle from '../../styles/MoxitoStyle';
import { COLORS } from '../../themes/colors';
import useTheme from '../../themes/ThemeProvider';
import { UserProps } from '../../types/Props';

const geofire = require('geofire-common');

const Countdown = ({ onComplete }: any) => (
  <CountdownCircleTimer
    isPlaying
    duration={10}
    colors={[
      ['#004777', 0.4],
      ['#F7B801', 0.4],
      ['#A30000', 0.2],
    ]}
    onComplete={onComplete}
  >
    {({ remainingTime, animatedColor }: any) => (
      <Animated.Text style={{ color: animatedColor }}>
        {remainingTime}
      </Animated.Text>
    )}
  </CountdownCircleTimer>
);

export default function AcceptRace({ user: user }: UserProps) {
  const [race, loading] = getRace(user.currentRaceId!);

  const [joinDistance, setJoinDistance] = useState(0);

  useEffect(() => {
    if(loading) return;
    setJoinDistance(Math.round(geofire.distanceBetween([user.pos!.lat, user.pos!.lng], [race.from.pos.lat, race.from.pos.lng])));
  }, [race])

  const accept = () => {
    acceptRace(user.currentRaceId!, joinDistance, () => {
      updateCurrentUser({ status: UserStatus.racing });
      updateUser(race.customer.id, { status: UserStatus.racing });
    });
  };

  const decline = () => {
    if (!user.currentRaceId) return;
    declineRace(user.currentRaceId!, () => {
      updateCurrentUser({
        status: UserStatus.idle,
        currentRaceId: firebase.firestore.FieldValue.delete(),
      });
    });
  };


  const theme = useTheme();
  const commonStyle = CommonStyle(theme);
  const moxitoStyle = MoxitoStyle(theme);
  return (
    <ImageBackground
      source={require('../../assets/logos/bg-logos.png')}
      style={moxitoStyle.backgroundImage}
      imageStyle={{ resizeMode: 'repeat' }}
    >
      <View style={moxitoStyle.container}>
        <Moxito width={200}></Moxito>
        <Title
          style={{ alignSelf: 'center', fontSize: 25, color: COLORS.grey }}
        >
          Nouvelle course
        </Title>
        {loading ? (
          <Loading />
        ) : (
          <>
            <CrossTable
              child1={
                <CrossTableCell
                  title={joinDistance + ' Km'}
                  subtitle={"jusqu'au client"}
                />
              }
              child2={
                <CrossTableCell
                  title={race.raceDistance + ' Km'}
                  subtitle={'de course'}
                />
              }
              child3={
                <CrossTableCell
                  title={fx(race.price).to(user.currency)}
                  subtitle={user.currency!}
                />
              }
              child4={
                <CrossTableCell
                  title={Math.round(race.estimateDuration/60) + ' min'}
                  subtitle={'de trajet'}
                />
              }
            />
            <Countdown onComplete={decline} />
            <MyButton title="Accepter" onPress={() => accept()} />
            <MyButton title="Refuser" onPress={() => decline()} />
          </>
        )}
      </View>
    </ImageBackground>
  );
}

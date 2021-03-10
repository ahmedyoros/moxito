import * as firebase from 'firebase/app';
import 'firebase/firestore';
import React from 'react';
import { Animated, ImageBackground, Text, View } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import Moxito from '../../assets/logos/moxito-w.svg';
import { acceptRace, declineRace, getRace } from '../../backend/RaceManager';
import { updateCurrentUser, updateUser } from '../../backend/UserManager';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { UserStatus } from '../../enums/Status';
import CommonStyle from '../../styles/CommonStyle';
import MoxitoStyle from '../../styles/MoxitoStyle';
import useTheme from '../../themes/ThemeProvider';
import { UserProps } from '../../types/Props';

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

  const accept = () => {
    acceptRace(user.currentRaceId!, () => {
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
        <Moxito></Moxito>
        <Text style={moxitoStyle.text}>Nouvelle course !</Text>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Countdown onComplete={decline} />
            <MyButton title="Accepter" onPress={() => accept()} />
            <MyButton title="Refuser" onPress={() => decline()} />
          </>
        )}
      </View>
    </ImageBackground>
  );
}

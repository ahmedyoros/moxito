import React from 'react';
import { Animated, ImageBackground, View } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Title } from 'react-native-paper';
import Moxito from '../../assets/logos/moxito-w.svg';
import { acceptRace, declineRace } from '../../backend/RaceManager';
import { updateCurrentUser, updateUser } from '../../backend/UserManager';
import CrossTable from '../../components/CrossTable';
import CrossTableCell from '../../components/CrossTableCell';
import Loading from '../../components/Loading';
import MyButton from '../../components/MyButton';
import { deleteField, functions } from '../../config';
import { UserStatus } from '../../enums/Status';
import MoxitoStyle from '../../styles/MoxitoStyle';
import { COLORS } from '../../themes/colors';
import useTheme from '../../themes/ThemeProvider';
import { UserRaceProps } from '../../types/Props';
import { getDistanceInKm } from '../../utils/calculator';

const Countdown = ({ onComplete }: any) => (
  <CountdownCircleTimer
    isPlaying
    duration={20}
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

export default function AcceptRace({ user, race }: UserRaceProps) {
  const notifyUser = functions.httpsCallable('notifyUser');

  const accept = () => {
    acceptRace(user, () => {
      updateCurrentUser({ status: UserStatus.racing });
      updateUser(race!.customer.id, { status: UserStatus.racing });
      notifyUser({ id: race!.customer.id, message:'🏍️ Course trouvée !'});
    });
  };

  const decline = () => {
    if (!user.currentRaceId) return;
    declineRace(user.currentRaceId!, () => {
      updateCurrentUser({
        status: UserStatus.idle,
        currentRaceId: deleteField(),
      });
    });
  };

  const theme = useTheme();
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
        {!race ? (
          <Loading />
        ) : (
          <>
            <CrossTable
              child1={
                <CrossTableCell
                  title={
                    getDistanceInKm(user.pos!, race.from.pos!).toFixed(1) + ' Km'
                  }
                  subtitle={"jusqu'au client"}
                />
              }
              child2={
                <CrossTableCell
                  title={race.raceDistance.toFixed(1) + ' Km'}
                  subtitle={'de course'}
                />
              }
              child3={
                <CrossTableCell
                  title={race.price.toString()}
                  subtitle={user.currency || 'GNF'}
                />
              }
              child4={
                <CrossTableCell
                  title={race.estimateDuration + ' min'}
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

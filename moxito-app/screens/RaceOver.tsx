import * as firebase from 'firebase/app';
import 'firebase/firestore';
import React from 'react';
import { ImageBackground, View } from 'react-native';
import { Title } from 'react-native-paper';
import Moxito from '../assets/logos/moxito-w.svg';
import { getRace } from '../backend/RaceManager';
import { updateCurrentUser } from '../backend/UserManager';
import CrossTable from '../components/CrossTable';
import CrossTableCell from '../components/CrossTableCell';
import Loading from '../components/Loading';
import MyButton from '../components/MyButton';
import fx from '../currency.config';
import { Role } from '../enums/Role';
import MoxitoStyle from '../styles/MoxitoStyle';
import { COLORS } from '../themes/colors';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';
import { User } from '../types/User';

export default function RaceOver({ navigation, route }: NavigationProps) {
  const user: User = route.params!.user;
  const [race, loading] = getRace(user.currentRaceId!);

  const theme = useTheme();
  const moxitoStyle = MoxitoStyle(theme);

  if (loading) return <Loading />;
  const shift =
    (race.createdAt + race.estimateDuration * 1000 - race.endedAt!) / 3600;
  const totalDuration =
    ((user.role === Role.Driver ? race.createdAt : race.startedAt!) -
      race.endedAt!) /
    3600;
  return (
    <ImageBackground
      source={require('../assets/logos/bg-logos.png')}
      style={moxitoStyle.backgroundImage}
      imageStyle={{ resizeMode: 'repeat' }}
    >
      <View style={moxitoStyle.container}>
        <Moxito width={200}></Moxito>
        <Title
          style={{ alignSelf: 'center', fontSize: 25, color: COLORS.grey }}
        >
          Course terminée
        </Title>
        {loading ? (
          <Loading />
        ) : (
          <>
            <CrossTable
              child1={
                <CrossTableCell
                  title={race.joinDistance + ' Km'}
                  subtitle={"jusqu'" + (user.role === Role.Driver ? 'au client' : 'à vous')}
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
                  title={Math.round(Math.abs(shift)) + ' min'}
                  subtitle={shift < 0 ? 'de retard' : "d'avance"}
                />
              }
              child4={
                <CrossTableCell
                  title={Math.round(Math.abs(totalDuration)) + ' min'}
                  subtitle="de trajet total"
                />
              }
            />
            <Title
              style={{ alignSelf: 'center', fontSize: 25, color: COLORS.grey }}
            >
              {fx(race.price).to(user.currency)} {user.currency}
            </Title>
            <MyButton
              title="Valider"
              onPress={() => {
                updateCurrentUser({currentRaceId: firebase.firestore.FieldValue.delete()});
                navigation.navigate('Noter', { race: race, user: user })
              }}
            />
          </>
        )}
      </View>
    </ImageBackground>
  );
}

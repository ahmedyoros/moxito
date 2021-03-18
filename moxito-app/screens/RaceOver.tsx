import React from 'react';
import { ImageBackground, View } from 'react-native';
import { Title } from 'react-native-paper';
import Moxito from '../assets/logos/moxito-w.svg';
import { getRace } from '../backend/RaceManager';
import CrossTable from '../components/CrossTable';
import CrossTableCell from '../components/CrossTableCell';
import Loading from '../components/Loading';
import MyButton from '../components/MyButton';
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
    (race.endedAt! - (race.startedAt! + race.estimateDuration * 60000)) / 60000;
  const totalDuration = (race.endedAt! - race.acceptedAt!) / 60000;
  const joinDuration = (race.startedAt! - race.acceptedAt!) / 60000;

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
                  title={Math.round(joinDuration) + ' min'}
                  subtitle={
                    "jusqu'" +
                    (user.role === Role.Driver ? 'au client' : 'à vous')
                  }
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
                  title={Math.round(Math.abs(shift)) + ' min'}
                  subtitle={shift > 0 ? 'de retard' : "d'avance"}
                />
              }
              child4={
                <CrossTableCell
                  title={Math.round(totalDuration) + ' min'}
                  subtitle="de trajet total"
                />
              }
            />
            <Title
              style={{ alignSelf: 'center', fontSize: 25, color: COLORS.grey }}
            >
              {race.price} {user.currency || 'GNF'}
            </Title>
            <MyButton
              title="Valider"
              onPress={() =>
                navigation.navigate('Noter', { race: race, user: user })
              }
            />
          </>
        )}
      </View>
    </ImageBackground>
  );
}

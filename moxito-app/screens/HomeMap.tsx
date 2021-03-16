import { useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFavoriteAddresses } from '../backend/FavoriteManager';
import { getRace, useRace } from '../backend/RaceManager';
import { Role } from '../enums/Role';
import { UserStatus } from '../enums/Status';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { Address } from '../types/Address';
import { MyRouteProp, UserProps } from '../types/Props';
import CreateRace from './customer/CreateRace';
import FollowDriver from './customer/FollowDriver';
import AcceptRace from './driver/AcceptRace';
import FollowRace from './driver/FollowRace';
import Idle from './driver/Idle';
import SearchRace from './driver/SearchRace';
import Verification from './driver/Verification';
import MyMapView from './MyMapView';
import PublicProfile from './PublicProfile';
import RaceOver from './RaceOver';
import UserReview from './UserReview';

const Stack = createStackNavigator();

export default function HomeMap({user}: UserProps) {
  console.log('rendering...');

  const route: MyRouteProp = useRoute();

  const [favoriteAddresses] = useFavoriteAddresses();
  const [race, raceLoading] = useRace(user.currentRaceId! || 'null');
  const [fromAddress, setFromAddress] = useState<Address>();
  const [toAddress, setToAddress] = useState<Address>();
  console.log(race?.status);
  
  useEffect(() => {
    if(!race) return;
    
    setToAddress(race.to);
    setFromAddress(race.from);
  }, [raceLoading])

  useEffect(() => setToAddress(route.params?.toAddress), [
    route.params?.toAddress,
  ]);

  useEffect(() => setFromAddress(route.params?.fromAddress), [
    route.params?.fromAddress,
  ]);

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  if (user.status === UserStatus.arrived) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="RaceOver"
          component={RaceOver}
          initialParams={{ user: user }}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Noter" component={UserReview} />
        <Stack.Screen name="Profile" component={PublicProfile} />
      </Stack.Navigator>
    );
  }

  if (user.role === Role.Driver) {
    if (!user.verified) return <Verification user={user} />;
    if (user.status === UserStatus.accepting) return <AcceptRace user={user} />;
  }

  return (
    <View style={commonStyle.container}>
      <MyMapView toAddress={toAddress} fromAddress={fromAddress} user={user} />

      {user.status === UserStatus.racing ? (
        user.role === Role.Customer ? (
          <FollowDriver user={user} race={race} />
        ) : (
          <FollowRace user={user} race={race} />
        )
      ) : user.role === Role.Customer ? (
        <CreateRace
          toAddress={toAddress}
          fromAddress={fromAddress}
          favoriteAddresses={favoriteAddresses}
          user={user}
        />
      ) : (
        <Stack.Navigator
          initialRouteName={
            user.status === UserStatus.idle ? 'Idle' : 'SearchRace'
          }
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="Idle"
            component={Idle}
            initialParams={{ user: user }}
          />
          <Stack.Screen
            name="SearchRace"
            component={SearchRace}
            initialParams={{ user: user }}
          />
        </Stack.Navigator>
      )}
    </View>
  );
}

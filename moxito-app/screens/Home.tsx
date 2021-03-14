import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useCurrentUser } from '../backend/UserManager';
import Loading from '../components/Loading';
import { Role } from '../enums/Role';
import { UserStatus } from '../enums/Status';
import { LocationLatLng } from '../types/LocationLatLng';
import Chat from './Chat';
import FollowDriver from './customer/FollowDriver';
import SearchDriver from './customer/SearchDriver';
import SearchMap from './customer/SearchMap';
import AcceptRace from './driver/AcceptRace';
import FollowRace from './driver/FollowRace';
import Idle from './driver/Idle';
import SearchRace from './driver/SearchRace';
import Verification from './driver/Verification';
import PublicProfile from './PublicProfile';
import RaceOver from './RaceOver';
import UserReview from './UserReview';

const Stack = createStackNavigator();

export default function Home({ navigation}: any) {
  const [user, loading] = useCurrentUser();

  useEffect(() => {
    if (loading) return;
    const showHeader =
      user.status !== UserStatus.accepting &&
      user.status !== UserStatus.arrived;
    navigation.setOptions({ headerShown: false });
  });

  if (loading) return <Loading />;

  //Common screens
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
    if(!user.verified)
      return <Verification user={user}/>
    switch (user.status) {
      default:
        //idle
        return <Idle user={user} />;
      case UserStatus.searching:
        return <SearchRace user={user} />;
      case UserStatus.accepting:
        return <AcceptRace user={user} />;
      case UserStatus.racing:
        return (
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="FollowRace"
          >
            <Stack.Screen
              name="FollowRace"
              component={FollowRace}
              initialParams={{ user: user }}
            />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Profile" component={PublicProfile} />
          </Stack.Navigator>
        );
    }
  }
  switch (user.status) {
    default:
      //idle
      return <SearchMap user={user}/>;
    case UserStatus.searching:
      return <SearchDriver user={user} />;
    case UserStatus.racing:
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="FollowDriver"
            component={FollowDriver}
            initialParams={{ user: user }}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="Profile" component={PublicProfile} />
        </Stack.Navigator>
      );
  }
}

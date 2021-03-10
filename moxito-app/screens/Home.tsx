import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import useCurrentUser from '../backend/UserManager';
import Loading from '../components/Loading';
import { Role } from '../enums/Role';
import { UserStatus } from '../enums/Status';
import Chat from './Chat';
import FollowDriver from './customer/FollowDriver';
import SearchDriver from './customer/SearchDriver';
import SearchMap from './customer/SearchMap';
import AcceptRace from './driver/AcceptRace';
import FollowRace from './driver/FollowRace';
import Idle from './driver/Idle';
import SearchRace from './driver/SearchRace';

const Stack = createStackNavigator();

export default function Home() {
  const [user, loading] = useCurrentUser();
  if (loading) return <Loading />;

  if (user.role === Role.Driver) {
    switch (user.status) {
      default:
        //idle
        return <Idle />;
      case UserStatus.searching:
        return <SearchRace />;
      case UserStatus.accepting:
        return <AcceptRace user={user} />;
      case UserStatus.racing:
        return (
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="FollowRace" >
            <Stack.Screen name="FollowRace" component={FollowRace} initialParams={{ user: user}} />
            <Stack.Screen name="Chat" component={Chat}/>
          </Stack.Navigator>
        );
    }
  }

  switch (user.status) {
    default:
      //idle
      return <SearchMap user={user} />;
    case UserStatus.searching:
      return <SearchDriver user={user} />;
    case UserStatus.racing:
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="FollowDriver" >
          <Stack.Screen name="FollowDriver" component={FollowDriver} initialParams={{ user: user}} />
          <Stack.Screen name="Chat" component={Chat}/>
        </Stack.Navigator>
      );
  }
}

import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useCurrentUser } from '../backend/UserManager';
import Loading from '../components/Loading';
import { Role } from '../enums/Role';
import { UserStatus } from '../enums/Status';
import { COLORS } from '../themes/colors';
import useTheme from '../themes/ThemeProvider';
import { NavigationProps } from '../types/Props';
import Chat from './Chat';
import AddressAutocomplete from './customer/map/AddressAutocomplete';
import HomeMap from './HomeMap';
import AcceptRace from './driver/AcceptRace';
import FollowRace from './driver/FollowRace';
import Idle from './driver/Idle';
import SearchRace from './driver/SearchRace';
import Verification from './driver/Verification';
import PublicProfile from './PublicProfile';
import RaceOver from './RaceOver';
import UserReview from './UserReview';

const Stack = createStackNavigator();

export default function Home({ navigation }: NavigationProps) {
  const [user, loading] = useCurrentUser();
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
    if (!user.verified) return <Verification user={user} />;
    if (user.status === UserStatus.accepting) return <AcceptRace user={user} />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMap"
        component={HomeMap}
        initialParams={{ user: user }}
        options={{
          headerTransparent: true,
          headerTitle: () => null,
          headerLeft: () => (
            <Ionicons
              style={{
                marginLeft: 10,
              }}
              name="menu"
              size={30}
              color={COLORS.black}
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}
            />
          ),
        }}
      />
      {user.role === Role.Customer && (
        <Stack.Screen
          name="AddressAutocomplete"
          component={AddressAutocomplete}
        />
      )}
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Profile" component={PublicProfile} />
    </Stack.Navigator>
  );
}

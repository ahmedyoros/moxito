import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { getRace } from '../backend/RaceManager';
import { useCurrentUser } from '../backend/UserManager';
import Loading from '../components/Loading';
import { COLORS } from '../themes/colors';
import { NavigationProps } from '../types/Props';
import Chat from './Chat';
import AddressAutocomplete from './customer/map/AddressAutocomplete';
import HomeMap from './HomeMap';
import PublicProfile from './PublicProfile';

const Stack = createStackNavigator();

export default function Home({ navigation }: NavigationProps) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMap"
        component={LoadHomeMap}
        options={{
          headerShown:false,
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
      <Stack.Screen
        name="AddressAutocomplete"
        component={AddressAutocomplete}
      />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Profile" component={PublicProfile} />
    </Stack.Navigator>
  );
}

function LoadHomeMap({route, navigation}: NavigationProps) {
  const [user, loading] = useCurrentUser();
  if(loading) return <Loading />;
  return <HomeMap user={user}/>
}

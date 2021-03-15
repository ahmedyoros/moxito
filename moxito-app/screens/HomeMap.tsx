import { Entypo } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import usePermissions from 'expo-permissions-hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Headline } from 'react-native-paper';
import { useFavoriteAddresses } from '../backend/FavoriteManager';
import { getRace } from '../backend/RaceManager';
import Loading from '../components/Loading';
import { Role } from '../enums/Role';
import { UserStatus } from '../enums/Status';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { Address } from '../types/Address';
import { Pos, toPos } from '../types/Pos';
import { NavigationProps } from '../types/Props';
import { User } from '../types/User';
import CreateRace from './customer/CreateRace';
import FollowDriver from './customer/FollowDriver';
import FollowRace from './driver/FollowRace';
import Idle from './driver/Idle';
import SearchRace from './driver/SearchRace';

const Stack = createStackNavigator();

export default function HomeMap({ navigation, route }: NavigationProps) {
  const [pos, setPos] = useState<Pos>();
  const { isGranted, isDenied } = usePermissions('LOCATION');
  const [favoriteAddresses] = useFavoriteAddresses();
  const user: User = route.params!.user;
  const [race, loading] = getRace(user.id);

  useEffect(() => {
    if (isGranted)
      Location.getCurrentPositionAsync().then((position) =>
        setPos(toPos(position))
      );
  }, [isGranted]);

  const [fromAddress, setFromAddress] = useState<Address>();
  const [toAddress, setToAddress] = useState<Address>();

  useEffect(() => {
    if (!race) return;
    setFromAddress(race.from);
    setToAddress(race.to);
  }, [loading]);

  const ref = useRef<MapView>(null);

  useEffect(() => {
    if (!pos) return;
    if (Platform.OS === 'ios') {
      ref?.current?.fitToElements(false);
    } else {
      setTimeout(() => {
        const coords = [pos];
        if (toAddress) coords.push(toAddress.pos);
        ref?.current?.fitToCoordinates(coords),
          {
            animated: true,
            edgePadding: {
              top: 150,
              right: 50,
              bottom: 50,
              left: 50,
            },
          };
      }, 0);
    }
  }, [toAddress, pos]);

  useEffect(() => setToAddress(route.params?.toAddress), [
    route.params?.toAddress,
  ]);

  useEffect(() => setFromAddress(route.params?.fromAddress), [
    route.params?.fromAddress,
  ]);

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  return (
    <View style={commonStyle.container}>
      {!pos ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '68%',
          }}
        >
          {isDenied ? (
            <Headline>Vous n'avez pas autorisé la géolocalisation</Headline>
          ) : (
            <>
              <Loading />
              <Headline>Géolocalisation en cours...</Headline>
            </>
          )}
        </View>
      ) : (
        <MapView
          ref={ref}
          style={{ width: '100%', height: '68%' }}
          followsUserLocation
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: pos.latitude,
            longitude: pos.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
        >
          {fromAddress && (
            <Marker
              title={fromAddress.street}
              description={fromAddress.city}
              coordinate={{
                latitude: fromAddress.pos.latitude,
                longitude: fromAddress.pos.longitude,
              }}
            >
              <Entypo name="home" size={25} color={theme.colors.primary} />
            </Marker>
          )}

          {toAddress && (
            <Marker
              title={toAddress.street}
              description={toAddress.city}
              coordinate={{
                latitude: toAddress.pos.latitude,
                longitude: toAddress.pos.longitude,
              }}
            >
              <Entypo
                name="location-pin"
                size={25}
                color={theme.colors.primary}
              />
            </Marker>
          )}
        </MapView>
      )}

      {user.status === UserStatus.racing &&
        (user.role === Role.Customer ? <FollowDriver /> : <FollowRace />)}

      {[UserStatus.searching, UserStatus.idle].includes(user.status) &&
        (user.role === Role.Customer ? (
          <CreateRace
            toAddress={toAddress}
            fromAddress={fromAddress}
            favoriteAddresses={favoriteAddresses}
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
        ))}
    </View>
  );
}

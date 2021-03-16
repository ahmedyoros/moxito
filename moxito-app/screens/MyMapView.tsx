import { Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import usePermissions from 'expo-permissions-hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Headline } from 'react-native-paper';
import { useFavoriteAddresses } from '../backend/FavoriteManager';
import { getRace, useRace } from '../backend/RaceManager';
import { getBaseUser, useCurrentUser } from '../backend/UserManager';
import Loading from '../components/Loading';
import { Role } from '../enums/Role';
import { UserStatus } from '../enums/Status';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import { Address } from '../types/Address';
import { Pos, toPos } from '../types/Pos';
import { MyNavigationProp, MyRouteProp, NavigationProps } from '../types/Props';
import CreateRace from './customer/CreateRace';
import FollowDriver from './customer/FollowDriver';
import AcceptRace from './driver/AcceptRace';
import FollowRace from './driver/FollowRace';
import Idle from './driver/Idle';
import SearchRace from './driver/SearchRace';
import Verification from './driver/Verification';
import PublicProfile from './PublicProfile';
import RaceOver from './RaceOver';
import UserReview from './UserReview';

type Props = {
  toAddress: Address | undefined;
  fromAddress: Address | undefined;
}

export default function MyMapView({toAddress, fromAddress}: Props) {
  const [pos, setPos] = useState<Pos>();
  const { isGranted, isDenied, ask } = usePermissions('LOCATION');

  useEffect(() => {
    if (isGranted)
      Location.getCurrentPositionAsync().then((position) =>
        setPos(toPos(position))
      );
    else ask();
  }, [isGranted]);

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

  const theme = useTheme();
  return !pos ? (
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
          <Entypo name="location-pin" size={25} color={theme.colors.primary} />
        </Marker>
      )}
    </MapView>
  );
}

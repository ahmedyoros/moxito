import { Entypo } from '@expo/vector-icons';
import * as Location from 'expo-location';
import usePermissions from 'expo-permissions-hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Headline } from 'react-native-paper';
import Loading from '../components/Loading';
import { UserStatus } from '../enums/Status';
import useTheme from '../themes/ThemeProvider';
import { Address } from '../types/Address';
import { Pos, toPos } from '../types/Pos';
import { User } from '../types/User';

type Props = {
  toAddress: Address | undefined;
  fromAddress: Address | undefined;
  user: User;
};

export default function MyMapView({ toAddress, fromAddress, user }: Props) {
  const [pos, setPos] = useState<Pos>();
  const { isGranted, isDenied, ask } = usePermissions('LOCATION');
  
  const ref = useRef<MapView>(null);

  useEffect(() => {
    if(!toAddress || user.status != UserStatus.idle) return;
    if (Platform.OS === 'ios') {
      ref?.current?.fitToElements(false);
    } else {
      const coords: Pos[] = [];
      if (toAddress) coords.push(toAddress.pos);
      if (fromAddress) coords.push(fromAddress.pos);
      ref?.current?.fitToCoordinates(coords, { animated: true, edgePadding:{ 
        bottom:20,
        top:50,
        right:20,
        left:20
      } });
    }
  }, [toAddress, fromAddress]);

  useEffect(() => {
    if (isGranted)
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 1,
        },
        (location) => setPos(toPos(location))
      );
    else ask();
  }, [isGranted]);

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
      initialRegion={{
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

      {toAddress && fromAddress && (
        <Polyline
          coordinates={[fromAddress.pos, toAddress.pos]}
          strokeColor={theme.colors.primary} // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={5}
          lineDashPattern={[50, 50]}
        />
      )}
    </MapView>
  );
}

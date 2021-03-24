import { Entypo, FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { usePermissions, PermissionStatus } from 'expo-permissions';
import React, { useEffect, useRef, useState } from 'react';
import { Linking, Platform, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Headline } from 'react-native-paper';
import { updateDriverPos } from '../backend/RaceManager';
import Loading from '../components/Loading';
import { Role } from '../enums/Role';
import { RaceStatus } from '../enums/Status';
import { COLORS } from '../themes/colors';
import useTheme from '../themes/ThemeProvider';
import { Address } from '../types/Address';
import { Pos, toPos } from '../types/Pos';
import { UserRaceProps } from '../types/Props';
import { getModelColor } from '../utils/motoModel';
import * as Permissions from 'expo-permissions';
import MyButton from '../components/MyButton';
import { updateCurrentUser } from '../backend/UserManager';

type Props = UserRaceProps & {
  toAddress: Address | undefined;
  fromAddress: Address | undefined;
};

export default function MyMapView({
  toAddress,
  fromAddress,
  user,
  race,
}: Props) {
  const [pos, setPos] = useState<Pos | undefined>(user.pos);
  const [permission, askPermission] = usePermissions(Permissions.LOCATION, {
    ask: true,
  });
  const ref = useRef<MapView>(null);

  const [coords, setCoords] = useState<Pos[]>([]);  

  useEffect(() => {
    if (!(permission?.status === PermissionStatus.GRANTED)) return;
    const watchPosition = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 10,
      },
      (location) => {
        const pos = toPos(location);
        setPos(pos);
        updateCurrentUser({pos: pos});
        if (user.role === Role.Driver && race?.status === RaceStatus.pickingUp)
          updateDriverPos(user.currentRaceId!, pos);
      }
    );

    return () => {
      watchPosition.then(({ remove }) => remove());
    };
  }, [permission]);

  useEffect(() => {
    if (!fromAddress || !toAddress) setCoords([]);
    else if (race?.status === RaceStatus.pickingUp) {
      setCoords([race.driver!.pos!, race.from.pos]);
    } else if (race?.status === RaceStatus.ongoing)
      setCoords([race.driver!.pos!, toAddress.pos]);
    else {
      setCoords([fromAddress.pos, toAddress.pos]);
    }
  }, [toAddress, fromAddress, race?.driver?.pos]);

  useEffect(() => {
    if (coords === []) return;
    if (Platform.OS === 'ios') {
      ref?.current?.fitToElements(false);
    } else {
      ref?.current?.fitToCoordinates(coords, {
        animated: true,
        edgePadding: {
          bottom: 20,
          top: 50,
          right: 20,
          left: 20,
        },
      });
    }
  }, [coords]);

  const theme = useTheme();
  const mapHeight = '65%';
  return !pos ? (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: mapHeight,
      }}
    >
      <Headline>Vous avons besoin de connaître votre position</Headline>
      {permission?.canAskAgain ? (
        <MyButton onPress={askPermission} title="Autoriser" />
      ) : (
        <MyButton onPress={Linking.openSettings} title="Paramètres de Moxito" />
      )}
    </View>
  ) : (
    <MapView
      ref={ref}
      style={{ width: '100%', height: mapHeight }}
      followsUserLocation
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: pos.latitude || 0,
        longitude: pos.longitude || 0,
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
          <Entypo name="home" size={25} color={COLORS.blue} />
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
          <Entypo name="location-pin" size={25} color={COLORS.blue} />
        </Marker>
      )}

      {user.role === Role.Customer && race?.status === RaceStatus.pickingUp && (
        <Marker
          title={race.driver!.displayName}
          coordinate={{
            latitude: race.driver!.pos!.latitude,
            longitude: race.driver!.pos!.longitude,
          }}
        >
          <FontAwesome
            name="motorcycle"
            size={24}
            color={getModelColor(race.driver!.motoModel!)}
          />
        </Marker>
      )}

      {coords.length == 2 && (
        <Polyline
          coordinates={coords}
          strokeColor={theme.colors.primary}
          strokeWidth={5}
          lineDashPattern={[50, 50]}
        />
      )}
    </MapView>
  );
}

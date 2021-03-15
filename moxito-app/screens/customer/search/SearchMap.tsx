import { Entypo } from '@expo/vector-icons';
import * as Location from 'expo-location';
import usePermissions from 'expo-permissions-hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Headline } from 'react-native-paper';
import { createRace } from '../../../backend/RaceMaker';
import { deleteRace } from '../../../backend/RaceManager';
import { getBaseUser, updateCurrentUser } from '../../../backend/UserManager';
import Loading from '../../../components/Loading';
import MyButton from '../../../components/MyButton';
import { deleteField } from '../../../config';
import { RaceStatus, UserStatus } from '../../../enums/Status';
import CommonStyle from '../../../styles/CommonStyle';
import useTheme from '../../../themes/ThemeProvider';
import { Address } from '../../../types/Address';
import { Pos, toPos } from '../../../types/Pos';
import { NavigationProps } from '../../../types/Props';
import { Race } from '../../../types/Race';
import { User } from '../../../types/User';
import AddressHolder from './AddressHolder';

const geofire = require('geofire-common');

export default function SearchMap({ navigation, route }: NavigationProps) {
  const [pos, setPos] = useState<Pos>();
  const { isGranted } = usePermissions('LOCATION');

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  useEffect(() => {
    if (isGranted)
      Location.getCurrentPositionAsync().then((position) =>
        setPos(toPos(position))
      );
  }, [isGranted]);

  const [fromAddress, setFromAddress] = useState<Address>();
  const [toAddress, setToAddress] = useState<Address>();

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

  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (!fromAddress || !toAddress) return;
    setDistance(
      geofire.distanceBetween(
        [fromAddress.pos.latitude, fromAddress.pos.longitude],
        [toAddress.pos.latitude, toAddress.pos.longitude]
      )
    );

    const estimatedSpeed = 36.2; // km/h
    setDuration((distance / estimatedSpeed) * 3600);

    setPrice(1500);
  }, [fromAddress, toAddress]);

  const [searching, setSearching] = useState(false);
  const [raceId, setRaceId] = useState<string>();

  useEffect(() => {
    const user: User = route.params!.user;
    console.log(user);
    
    setSearching(user.status === UserStatus.searching);
    setRaceId(user.currentRaceId);
  }, [
    route.params?.user,
  ]);

  const submit = () => {
    if (!fromAddress || !toAddress) return;
    const race: Race = {
      createdAt: Date.now(),
      from: fromAddress,
      to: toAddress,
      customer: getBaseUser(),
      raceDistance: distance,
      estimateDuration: duration,
      price: price,
      status: RaceStatus.pending,
    };

    createRace(race, (raceId: string) => {
      setRaceId(raceId);
      setSearching(true);
      updateCurrentUser({ currentRaceId: raceId, status:UserStatus.searching });
    });
  };

  const cancel = () => {
    deleteRace(raceId!);
    updateCurrentUser({
      status: UserStatus.idle,
      currentRaceId: deleteField(),
    });
    setSearching(false);
    setRaceId(undefined);
  }

  return (
    <View style={commonStyle.container}>
      {!pos ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '80%',
          }}
        >
          <Headline>En attente de votre position</Headline>
          <Loading />
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
      <View>
        <View>
          <AddressHolder
            suggestCurrentLocation={true}
            address={fromAddress}
            title="Départ"
            index="from"
            searching={searching}
          />
          <AddressHolder
            suggestCurrentLocation={false}
            address={toAddress}
            title="Déstination"
            index="to"
            searching={searching}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            borderColor: theme.colors.text,
            borderTopWidth: 1,
          }}
        >
          {!searching ? (
            <>
              <MyButton
                style={{ width: '30%', marginRight: 0 }}
                title="Valider"
                onPress={submit}
              />
              <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
                <Text
                  style={{
                    fontStyle: 'italic',
                    fontSize: 40,
                    color: theme.colors.primary,
                  }}
                >
                  {Math.round(price)}
                </Text>
                <Text
                  style={[
                    commonStyle.text,
                    { fontStyle: 'italic', textAlign: 'center' },
                  ]}
                >
                  GNF
                </Text>
              </View>
              <View style={{ flexDirection: 'column', marginTop: 10 }}>
                <Text style={[commonStyle.text, { fontStyle: 'italic' }]}>
                  {distance.toFixed(1)} km
                </Text>
                <Text style={[commonStyle.text, { fontStyle: 'italic' }]}>
                  {Math.round(duration / 60)} min
                </Text>
              </View>
            </>
          ) : (
            <>
              <MyButton
                style={{ width: '30%', marginRight: 0 }}
                title="Annuler"
                onPress={cancel}
              />
              <View style={{alignContent: 'center', left:20}}>
                <Loading size={50}/>
                <Text style={[commonStyle.text]}>Recherche en cours...</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
